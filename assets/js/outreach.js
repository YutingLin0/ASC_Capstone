/* Vertical scrolling slides the campaign views horizontally with tighter spacing. */
(() => {
  const story = document.querySelector(".outreach-scroll-story");
  if (!story) return;
  const stage = story.querySelector(".outreach-scroll-stage");
  const track = story.querySelector(".outreach-slide-track");
  const slides = [...track.children];
  const preference = matchMedia("(prefers-reduced-motion: reduce)");
  const clamp = (n) => Math.min(1, Math.max(0, n));
  let scheduled = false;
  function render() {
    scheduled = false;
    if (preference.matches) {
      track.style.transform = "";
      slides.forEach((slide) => {
        slide.inert = false;
      });
      return;
    }
    const top = parseFloat(getComputedStyle(stage).top) || 0;
    const distance = Math.max(1, story.offsetHeight - stage.offsetHeight);
    const progress = clamp(
      (top - story.getBoundingClientRect().top) / distance,
    );
    const position = clamp((progress - 0.035) / 0.93) * (slides.length - 1);
    const slideWidth = stage.clientWidth;
    track.style.transform = `translate3d(${-position * slideWidth}px,0,0)`;
    const active = Math.round(position);
    slides.forEach((slide, index) => {
      slide.inert = index !== active;
    });
  }
  function update() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(render);
  }
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  preference.addEventListener("change", update);
  render();
})();
