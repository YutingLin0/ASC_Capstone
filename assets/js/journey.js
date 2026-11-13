/* Scroll-driven journey with selectable modes in the opening and final overview. */
const journeyChapters = [
  {
    mode: "walk",
    color: "#2a77bd",
    label: "WALK / THE FIRST CONNECTION",
    title: "Every journey starts with access.",
  },
  {
    mode: "bus",
    color: "#c87500",
    label: "BUS / CONNECT THE NEIGHBORHOOD",
    title: "The next connection brings us further.",
  },
  {
    mode: "rail",
    color: "#008b3f",
    label: "RAIL / REACH A WIDER REGION",
    title: "A transfer opens up more destinations.",
  },
  {
    mode: "bike",
    color: "#5f71b6",
    label: "BIKE / COMPLETE THE CONNECTION",
    title: "The last mile matters, too.",
  },
  {
    mode: null,
    color: "#0c1d32",
    label: "TOGETHER / ONE CONNECTED JOURNEY",
    title: "Different modes. One complete picture.",
  },
];

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}
function smooth(value) {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
}
function journeyState(progress) {
  const p = clamp(progress);
  const phase = Math.min(3, Math.floor(clamp((p - 0.08) / 0.76) * 4));
  const local = clamp((p - (0.08 + phase * 0.19)) / 0.19);
  const position = [65.49, 759.05];
  return {
    phase: p >= 0.97 ? 4 : phase,
    travelPhase: phase,
    position,
    local,
    overview: p >= 0.97,
    zoom: smooth(p / 0.08) * (1 - smooth((p - 0.84) / 0.13)),
  };
}

function initializeJourney() {
  const scene = document.querySelector(".journey-story");
  if (!scene) return;
  const stage = scene.querySelector(".journey-stage");
  const svg = scene.querySelector("svg");
  const traveler = document.getElementById("traveler");
  const parts = [...svg.querySelectorAll("[data-mode]")];
  const illustrations = [...scene.querySelectorAll("[data-reveal-mode]")];
  const contentPanels = [...scene.querySelectorAll("[data-content-mode]")];
  const extensionClips = [...scene.querySelectorAll("[data-extension-clip]")];
  const connectionNodes = [...scene.querySelectorAll("[data-node-mode]")];
  const routePaths = [...svg.querySelectorAll("[data-route]")];
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  let selected = null,
    currentChapter = -1,
    overview = false,
    lastProgress = -1,
    ticking = false;
  let movementTimer;
  const revealWindows = new Map();
  // Begin an illustration reveal only when the drawn stroke reaches its bounds.
  illustrations.forEach((illustration) => {
    const route = svg.querySelector(
      `[data-route="${illustration.dataset.revealMode}"]`,
    );
    if (!route) return;
    const revealSource = illustration.dataset.revealSource
      ? document.getElementById(illustration.dataset.revealSource)
      : illustration;
    const box = revealSource.getBBox();
    const length = route.getTotalLength();
    let contact = 1;
    for (let sample = 0; sample <= 400; sample++) {
      const point = route.getPointAtLength((length * sample) / 400);
      if (
        point.x >= box.x - 12 &&
        point.x <= box.x + box.width + 12 &&
        point.y >= box.y - 12 &&
        point.y <= box.y + box.height + 12
      ) {
        contact = sample / 400;
        break;
      }
    }
    revealWindows.set(illustration, [contact, Math.min(1, contact + 0.16)]);
  });

  function highlight(mode) {
    selected = mode;
    parts.forEach((part) => {
      // Muting uses opaque colors; overlapping path pieces cannot accumulate alpha.
      const muted = Boolean(mode) && part.dataset.mode !== mode;
      part.classList.remove("dim");
      ["fill", "stroke"].forEach((attribute) => {
        const value = part.getAttribute(
          `data-${muted ? "muted" : "original"}-${attribute}`,
        );
        if (value) part.setAttribute(attribute, value);
      });
      if (part.classList.contains("hotspot"))
        part.setAttribute("aria-pressed", String(part.dataset.mode === mode));
    });
    scene.querySelectorAll(".mode-surface").forEach((surface) => {
      surface.setAttribute(
        "aria-pressed",
        String(
          (surface.dataset.contentMode || surface.dataset.revealMode) === mode,
        ),
      );
    });
    if (overview)
      contentPanels.forEach((content) => {
        content.style.opacity =
          mode && content.dataset.contentMode !== mode ? ".22" : "1";
        content.style.visibility = "visible";
      });
    illustrations.forEach((illustration) => {
      if (overview) {
        illustration.style.opacity =
          mode && illustration.dataset.revealMode !== mode ? ".4" : "1";
        illustration.style.visibility = "visible";
      }
    });
  }
  function selectMode(mode) {
    if (!overview) return;
    highlight(selected === mode ? null : mode);
    document.getElementById("journey-status").textContent = selected
      ? `${selected} highlighted. Select again to show all modes.`
      : "All transportation modes visible.";
  }
  parts.forEach((part) => {
    part.addEventListener("click", (event) => {
      event.stopPropagation();
      if (overview) {
        part.blur();
        selectMode(part.dataset.mode);
      }
    });
    if (part.classList.contains("hotspot"))
      part.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          selectMode(part.dataset.mode);
        }
      });
  });
  // Treat the complete illustration and callout surfaces as mode selectors.
  scene
    .querySelectorAll("[data-content-mode], [data-reveal-mode]")
    .forEach((surface) => {
      const mode = surface.dataset.contentMode || surface.dataset.revealMode;
      if (surface.dataset.revealSource) return; // A masking underlay is not a control.
      surface.classList.add("mode-surface");
      // Use actual painted shapes for illustration hits. Oversized transparent
      // rectangles can cover a neighboring mode's artwork.
      surface.setAttribute("role", "button");
      surface.setAttribute(
        "aria-label",
        `Highlight ${mode} and its related information`,
      );
      surface.addEventListener(
        "click",
        (event) => {
          if (!overview) return;
          event.stopPropagation();
          surface.blur();
          selectMode(mode);
        },
        true,
      );
      surface.addEventListener("keydown", (event) => {
        if (!overview || (event.key !== "Enter" && event.key !== " ")) return;
        event.preventDefault();
        event.stopPropagation();
        selectMode(mode);
      });
    });
  svg.addEventListener("click", () => {
    if (overview) highlight(null);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && overview) highlight(null);
  });

  function setChapter(index) {
    if (currentChapter === index) return;
    currentChapter = index;
    const chapter = journeyChapters[index];
    document.body.style.setProperty("--story-accent", chapter.color);
    document.getElementById("journey-status").textContent =
      chapter.label + ". " + chapter.title;
  }
  function render() {
    ticking = false;
    const stickyTop = parseFloat(getComputedStyle(stage).top) || 0;
    const travel = Math.max(1, scene.offsetHeight - stage.offsetHeight);
    const p = reducedMotion.matches
      ? 1
      : clamp((stickyTop - scene.getBoundingClientRect().top) / travel);
    // Reserve the first part of the pinned section for the complete overview.
    const introOverview = p < 0.09 && !reducedMotion.matches;
    const storyProgress = clamp((p - 0.09) / 0.91);
    const state = journeyState(reducedMotion.matches ? 1 : storyProgress);
    if (introOverview) {
      state.phase = 4;
      state.overview = true;
      state.zoom = 0;
    }
    const activePath = routePaths.find(
      (path) => path.dataset.route === journeyChapters[state.travelPhase].mode,
    );
    if (activePath) {
      const point = activePath.getPointAtLength(
        activePath.getTotalLength() * state.local,
      );
      state.position = [point.x, point.y];
    }
    const wasOverview = overview;
    overview = state.overview;
    scene.classList.toggle("overview", overview);
    setChapter(state.phase);

    if (!overview) highlight(null);
    else if (!wasOverview) highlight(null);

    routePaths.forEach((path, index) => {
      const progress =
        overview || index < state.travelPhase
          ? 1
          : index > state.travelPhase
            ? 0
            : state.local;
      path.style.strokeDashoffset = String(100 * (1 - progress));
      path.style.visibility = progress < 0.001 ? "hidden" : "visible";
    });
    if (!overview)
      illustrations.forEach((illustration) => {
        const index = journeyChapters.findIndex(
          (chapter) => chapter.mode === illustration.dataset.revealMode,
        );
        const [start, end] = revealWindows.get(illustration) || [0.7, 0.86];
        const approach =
          state.travelPhase > index
            ? 1
            : state.travelPhase < index
              ? 0
              : smooth((state.local - start) / Math.max(0.01, end - start));
        illustration.style.opacity = String(approach);
        illustration.style.visibility = approach < 0.01 ? "hidden" : "visible";
      });

    // Only reveal continuation routes once the traveler has reached their connection.
    const extensionTiming = {
      walk: [0.27, 0.65],
      bus: [0.46, 0.94],
      rail: [0.65, 0.97],
    };
    extensionClips.forEach((clip) => {
      const [start, end] = extensionTiming[clip.dataset.extensionClip];
      const progress = overview
        ? 1
        : clamp((storyProgress - start) / (end - start));
      clip.setAttribute(
        "width",
        String(Number(clip.dataset.extensionWidth) * progress),
      );
    });
    connectionNodes.forEach((node) => {
      const index = journeyChapters.findIndex(
        (chapter) => chapter.mode === node.dataset.nodeMode,
      );
      const threshold = node.dataset.nodeEnd
        ? 0.84
        : index === 0
          ? 0
          : 0.08 + index * 0.19;
      node.style.visibility =
        overview || storyProgress >= threshold ? "visible" : "hidden";
    });

    // Bring each mode's original labels, description, and statistics into the story.
    contentPanels.forEach((content) => {
      const index = journeyChapters.findIndex(
        (chapter) => chapter.mode === content.dataset.contentMode,
      );
      const visible = overview
        ? selected && content.dataset.contentMode !== selected
          ? 0.22
          : 1
        : state.travelPhase > index
          ? 1
          : state.travelPhase < index
            ? 0
            : smooth((state.local - 0.02) / 0.28);
      content.style.opacity = String(visible);
      content.style.visibility = visible < 0.01 ? "hidden" : "visible";
      content.style.pointerEvents = visible < 0.01 ? "none" : "";
    });
    scene.querySelectorAll(".mode-surface").forEach((surface) => {
      const mode = surface.dataset.contentMode || surface.dataset.revealMode;
      surface.setAttribute("tabindex", overview ? "0" : "-1");
      surface.setAttribute("aria-pressed", String(selected === mode));
    });

    // Hidden content must not leave invisible tab stops in the scroll sequence.
    parts
      .filter((part) => part.classList.contains("hotspot"))
      .forEach((hotspot) => {
        hotspot.setAttribute("tabindex", overview ? "0" : "-1");
      });

    // Pan along the route, then blend back to the original full artwork.
    const mobile = window.innerWidth < 760;
    const zoomWidth = mobile ? 620 : 1000;
    const width = 1440 + (zoomWidth - 1440) * state.zoom;
    const height = width * 0.6;
    // Follow the traveler in every mode, with a small vertical adjustment
    // for the taller walking/cycling figures. The existing zoom blends back
    // into the complete artwork at the beginning and end of the journey.
    const avatarCenterY = [24, 17, 18, 24][state.travelPhase];
    const focusX = state.position[0];
    const focusY = state.position[1] - avatarCenterY;
    const centerX = 720 + (focusX - 720) * state.zoom;
    const centerY = 432 + (focusY - 432) * state.zoom;
    svg.setAttribute(
      "viewBox",
      `${centerX - width / 2} ${centerY - height / 2} ${width} ${height}`,
    );
    traveler.setAttribute(
      "transform",
      `translate(${state.position.join(" ")})`,
    );
    traveler.style.opacity = introOverview
      ? "0"
      : String(
          (1 - smooth((storyProgress - 0.88) / 0.09)) *
            (storyProgress > 0 ? 1 : 0),
        );
    ["walk", "bus", "rail", "bike"].forEach((mode) => {
      document.getElementById(`${mode}-avatar`).style.display =
        mode === journeyChapters[state.travelPhase].mode ? "inline" : "none";
    });
    if (Math.abs(p - lastProgress) > 0.0001 && !overview) {
      traveler.classList.add("moving");
      clearTimeout(movementTimer);
      movementTimer = setTimeout(
        () => traveler.classList.remove("moving"),
        140,
      );
    }
    lastProgress = p;
    document.getElementById("story-progress").style.width = `${p * 100}%`;
  }
  function requestRender() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(render);
    }
  }
  window.addEventListener("scroll", requestRender, { passive: true });
  window.addEventListener("resize", requestRender);
  reducedMotion.addEventListener("change", requestRender);
  render();
}
if (typeof document !== "undefined") initializeJourney();
if (typeof module !== "undefined")
  module.exports = { journeyState, journeyChapters };
