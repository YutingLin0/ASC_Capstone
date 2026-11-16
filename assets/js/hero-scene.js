// Respect motion preferences and pause SVG animation outside the visible hero.
(() => {
  const hero = document.querySelector(".city-hero");
  if (!hero) return;
  const svg = hero.querySelector("svg");
  const preference = matchMedia("(prefers-reduced-motion: reduce)");
  let visible = true;
  const update = () => {
    if (preference.matches || document.hidden || !visible)
      svg.pauseAnimations();
    else svg.unpauseAnimations();
  };
  document.addEventListener("visibilitychange", update);
  preference.addEventListener("change", update);
  new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
    update();
  }).observe(hero);
  update();
})();
