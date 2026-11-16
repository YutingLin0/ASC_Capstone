// Progressive enhancement: content is visible without JavaScript or motion support.
(() => {
  const preference = matchMedia("(prefers-reduced-motion: reduce)");
  if (preference.matches || !("IntersectionObserver" in window)) return;
  const targets = document.querySelectorAll(
    ".journey-introduction > *, #investments > *, .outreach-heading > *, #learn > *",
  );
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -24px 0px" },
  );
  targets.forEach((target) => {
    target.classList.add("scroll-reveal");
    observer.observe(target);
  });
  preference.addEventListener("change", (event) => {
    if (event.matches) {
      observer.disconnect();
      targets.forEach((target) => target.classList.add("is-visible"));
    }
  });
})();
