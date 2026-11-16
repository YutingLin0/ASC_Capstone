/* Ambient campaign scene; pause when offscreen, in a background tab, or on request. */
(() => {
  const hero = document.querySelector(".city-hero");
  if (!hero) return;
  const control = document.getElementById("scene-motion-toggle");
  const preference = matchMedia("(prefers-reduced-motion: reduce)");
  let paused = false;
  let visible = true;
  function update() {
    hero.classList.toggle(
      "scene-paused",
      paused || !visible || document.hidden || preference.matches,
    );
    control.setAttribute("aria-pressed", String(paused));
    control.textContent = paused ? "Resume motion" : "Pause motion";
    control.hidden = preference.matches;
  }
  control.addEventListener("click", () => {
    paused = !paused;
    update();
  });
  document.addEventListener("visibilitychange", update);
  preference.addEventListener("change", update);
  new IntersectionObserver(
    (entries) => {
      visible = entries[0].isIntersecting;
      update();
    },
    { threshold: 0.05 },
  ).observe(hero);
  update();
})();
