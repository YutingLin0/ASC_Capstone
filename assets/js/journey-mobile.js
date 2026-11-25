// Mobile artwork is a vertical, readable companion to the desktop SVG scene.
(() => {
  const section = document.querySelector(".vertical-journey");
  if (!section) return;
  const body = section.querySelector(".vertical-route-body");
  const cards = [...section.querySelectorAll("[data-vertical-mode]")];
  const buttons = [...section.querySelectorAll("[data-vertical-jump]")];
  const preference = matchMedia("(prefers-reduced-motion: reduce)");
  buttons.forEach((button) =>
    button.addEventListener("click", () => {
      document
        .getElementById(`mobile-${button.dataset.verticalJump}`)
        .scrollIntoView({
          behavior: preference.matches ? "instant" : "smooth",
          block: "start",
        });
    }),
  );
  let queued = false;
  function render() {
    queued = false;
    if (window.innerWidth > 760) return;
    const rect = body.getBoundingClientRect();
    const start = cards[0].offsetTop + 2;
    const last = cards[cards.length - 1];
    const length = Math.max(1, last.offsetTop + last.offsetHeight + 12 - start);
    body.style.setProperty("--route-start", `${start}px`);
    body.style.setProperty("--route-length", `${length}px`);
    const colors = ["#2a77bd", "#f49c1e", "#00ac4e", "#5f71b6"];
    const stops = cards.map((card, i) => {
      const from = Math.max(0, ((card.offsetTop + 2 - start) / length) * 100);
      const to =
        i === cards.length - 1
          ? 100
          : ((cards[i + 1].offsetTop + 2 - start) / length) * 100;
      return `${colors[i]} ${from}% ${to}%`;
    });
    body.querySelector(".vertical-route-fill").style.background =
      `linear-gradient(to bottom, ${stops.join(",")})`;
    const progress = Math.max(
      0,
      Math.min(1, (window.innerHeight * 0.5 - rect.top - start) / length),
    );
    body.style.setProperty("--route-progress", `${progress * 100}%`);
    const traveled = progress * length;
    cards.forEach((card) => {
      const node = card.offsetTop + 2 - start;
      card.classList.toggle("route-reached", traveled >= node);
    });
    let current = cards[0].dataset.verticalMode;
    cards.forEach((card) => {
      if (card.getBoundingClientRect().top < window.innerHeight * 0.55)
        current = card.dataset.verticalMode;
    });
    buttons.forEach((button) =>
      button.setAttribute(
        "aria-current",
        String(button.dataset.verticalJump === current),
      ),
    );
  }
  const queue = () => {
    if (!queued) {
      queued = true;
      requestAnimationFrame(render);
    }
  };
  window.addEventListener("scroll", queue, { passive: true });
  window.addEventListener("resize", queue);
  section
    .querySelectorAll("img")
    .forEach((image) => image.addEventListener("load", queue));
  section
    .querySelectorAll("details")
    .forEach((detail) => detail.addEventListener("toggle", queue));
  new ResizeObserver(queue).observe(body);
  render();
})();
