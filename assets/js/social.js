(() => {
  const post = document.querySelector(".social-post");
  if (!post) return;
  const carousel = post.querySelector(".social-carousel");
  const track = post.querySelector(".social-track");
  const dots = [...post.querySelectorAll(".social-dot")];
  const previous = post.querySelector(".social-prev");
  const next = post.querySelector(".social-next");
  const status = post.querySelector(".social-status");
  const titles = [
    "The journey starts here.",
    "Then connects to more.",
    "And opens up access.",
    "Small changes go further.",
  ];
  const phone = document.querySelector(".social-phone");
  const story = document.getElementById("social");
  const stage = story.querySelector(".social-scroll-stage");
  const intro = story.querySelector(".social-intro");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let index = 0;
  const clamp = (value) => Math.max(0, Math.min(1, value));
  let frame = 0;
  function renderScroll() {
    frame = 0;
    if (reducedMotion.matches) {
      stage.style.removeProperty("--phone-shift");
      intro.style.opacity = "";
      intro.style.transform = "";
      intro.inert = false;
      return;
    }
    const top = parseFloat(getComputedStyle(stage).top) || 88;
    const distance = Math.max(1, story.offsetHeight - stage.offsetHeight);
    const progress = clamp(
      (top - story.getBoundingClientRect().top) / distance,
    );
    const center = clamp(progress / 0.24);
    const ease = center * center * (3 - 2 * center);
    const shift = window.innerWidth > 760 ? stage.clientWidth * 0.27 : 0;
    stage.style.setProperty("--phone-shift", `${shift * (1 - ease)}px`);
    intro.style.opacity = String(1 - ease);
    intro.style.transform = `translateY(${-28 * ease}px)`;
    intro.inert = ease > 0.98;
    const slide = Math.min(3, Math.floor(clamp((progress - 0.27) / 0.65) * 4));
    if (slide !== index) showSlide(slide, false);
  }
  function queueScroll() {
    if (!frame) frame = requestAnimationFrame(renderScroll);
  }
  window.addEventListener("scroll", queueScroll, { passive: true });
  window.addEventListener("resize", queueScroll);
  reducedMotion.addEventListener("change", renderScroll);
  function showSlide(value, announce = true) {
    index = Math.max(0, Math.min(dots.length - 1, value));
    track.style.transform = `translateX(${-index * 100}%)`;
    post.querySelector(".social-counter").textContent =
      `${index + 1} / ${dots.length}`;
    dots.forEach((dot, i) =>
      dot.setAttribute("aria-pressed", String(i === index)),
    );
    [...track.children].forEach((slide, i) =>
      slide.setAttribute("aria-hidden", String(i !== index)),
    );
    previous.disabled = index === 0;
    next.disabled = index === dots.length - 1;
    if (announce)
      status.textContent = `Slide ${index + 1} of ${dots.length} · ${titles[index]}`;
  }
  previous.addEventListener("click", () => showSlide(index - 1));
  next.addEventListener("click", () => showSlide(index + 1));
  dots.forEach((dot, i) => dot.addEventListener("click", () => showSlide(i)));
  carousel.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      showSlide(index + (event.key === "ArrowRight" ? 1 : -1));
    }
  });
  let start = null;
  carousel.addEventListener("pointerdown", (event) => {
    if (
      event.target.closest("button") ||
      (event.pointerType === "mouse" && event.button !== 0)
    )
      return;
    start = { x: event.clientX, y: event.clientY };
    carousel.setPointerCapture(event.pointerId);
  });
  carousel.addEventListener("pointerup", (event) => {
    if (!start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy))
      showSlide(index + (dx < 0 ? 1 : -1));
    start = null;
  });
  carousel.addEventListener("pointercancel", () => {
    start = null;
  });
  carousel.addEventListener("dragstart", (event) => event.preventDefault());
  [
    [".social-like", "Liked", "Like"],
    [".social-save", "Saved", "Save"],
  ].forEach(([selector, active, inactive]) => {
    const button = post.querySelector(selector);
    button.addEventListener("click", () => {
      const pressed = button.getAttribute("aria-pressed") !== "true";
      button.setAttribute("aria-pressed", String(pressed));
      button.setAttribute(
        "aria-label",
        `${pressed ? "Undo " + active.toLowerCase() : inactive} this post`,
      );
      status.textContent = pressed
        ? `${active} in this preview.`
        : `${active === "Liked" ? "Like" : "Save"} removed.`;
    });
  });
  showSlide(0);
  renderScroll();
})();
