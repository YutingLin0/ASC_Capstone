// Respect motion preferences and pause SVG animation outside the visible hero.
(() => {
  const hero = document.querySelector(".city-hero");
  if (!hero) return;
  const svg = hero.querySelector("svg");
  // Work in screen pixels so routes stay at the edges at every aspect ratio.
  function layoutRoutes() {
    const width = hero.clientWidth;
    const height = hero.clientHeight;
    if (!width || !height) return;
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    // Reference framing: axis-aligned runs joined by tangent-continuous bends.
    const mobile = width <= 760;
    const blueSide = width * (mobile ? 0.9 : 0.81);
    const greenSide = width * (mobile ? 0.98 : 0.92);
    const routes = {
      walk: {
        path: `M-150 ${height * 0.95}H${width * 0.61}C${width * 0.76} ${height * 0.95} ${blueSide} ${height * 0.95} ${blueSide} ${height * 0.75}V${height * 0.43}C${blueSide} ${height * 0.24} ${width * 0.88} ${height * 0.17} ${width} ${height * 0.17}H${width + 150}`,
      },
      bus: {
        path: `M-130 ${height * 0.51}H${width * 0.055}C${width * 0.15} ${height * 0.51} ${width * 0.2} ${height * 0.42} ${width * 0.2} ${height * 0.25}V-150`,
      },
      rail: {
        path: `M-150 ${height * 0.15}H${width * 0.68}C${width * 0.85} ${height * 0.15} ${greenSide} ${height * 0.2} ${greenSide} ${height * 0.44}V${height + 150}`,
      },
      bike: {
        path: `M-150 ${height * 0.73}H${width * 0.12}C${width * 0.23} ${height * 0.73} ${width * 0.25} ${height * 0.75} ${width * 0.25} ${height * 0.87}V${height + 150}`,
      },
    };
    if (mobile) {
      // Mobile sketch: two upper routes and two lower sweeps around a clear center.
      routes.bus.path = `M-110 ${height * 0.18}H${width * 0.47}C${width * 0.65} ${height * 0.18} ${width * 0.7} ${height * 0.15} ${width * 0.7} ${height * 0.09}V-120`;
      routes.rail.path = `M-120 ${height * 0.08}H${width * 0.64}C${width * 0.86} ${height * 0.08} ${width * 0.94} ${height * 0.15} ${width * 0.94} ${height * 0.29}V${height + 120}`;
      routes.walk.path = `M-120 ${height * 0.89}H${width * 0.44}C${width * 0.67} ${height * 0.89} ${width * 0.73} ${height * 0.85} ${width * 0.73} ${height * 0.76}V${height * 0.71}C${width * 0.73} ${height * 0.66} ${width * 0.77} ${height * 0.65} ${width * 0.86} ${height * 0.65}H${width + 120}`;
      routes.bike.path = `M-110 ${height * 0.66}H${width * 0.1}C${width * 0.34} ${height * 0.66} ${width * 0.42} ${height * 0.68} ${width * 0.42} ${height * 0.79}V${height + 120}`;
      routes.bus.node = [width * 0.35, height * 0.18];
      routes.rail.node = [width * 0.94, height * 0.43];
      routes.walk.node = [width * 0.73, height * 0.77];
      routes.bike.node = [width * 0.42, height * 0.91];
    }
    const accent = svg.querySelector("#hero-orange-continuation");
    if (accent) accent.style.display = mobile ? "none" : "";
    if (accent)
      accent.setAttribute(
        "d",
        `M${width * 0.87} ${height + 120}V${height * 0.88}C${width * 0.87} ${height * 0.75} ${width * 0.97} ${height * 0.72} ${width * 1.08} ${height * 0.72}H${width + 180}`,
      );
    Object.entries(routes).forEach(([mode, route]) => {
      const path = svg.querySelector(`#hero-route-${mode}`);
      path.setAttribute("d", route.path);
      const point = path.getPointAtLength(path.getTotalLength() * 0.62);
      const station = svg.querySelector(`[data-station="${mode}"]`);
      station.setAttribute("cx", route.node ? route.node[0] : point.x);
      station.setAttribute("cy", route.node ? route.node[1] : point.y);
      station.setAttribute("r", mobile ? "14" : "21");
    });
    const scale = mobile ? 0.46 : 0.85;
    svg.querySelectorAll(".hero-route-figure image").forEach((image) => {
      image.setAttribute("transform", `scale(${scale})`);
    });
  }
  new ResizeObserver(layoutRoutes).observe(hero);
  layoutRoutes();
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
