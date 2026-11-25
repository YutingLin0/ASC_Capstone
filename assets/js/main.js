/* Event information dialog and section navigation. */
const signupDialog = document.getElementById("signup");
document
  .querySelector(".event-meeting-link")
  ?.addEventListener("click", (event) => {
    event.preventDefault();
    signupDialog.showModal();
  });
document.getElementById("rsvp").addEventListener("click", () => {
  signupDialog.showModal();
});
document.getElementById("close").addEventListener("click", () => {
  signupDialog.close();
});
const sectionObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      document.querySelectorAll("nav .links a").forEach((link) => {
        if (
          link.hash ===
          `#${["journey-animation", "journey-mobile"].includes(entry.target.id) ? "journey" : entry.target.id}`
        ) {
          link.setAttribute("aria-current", "location");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    }
  },
  { rootMargin: "-20% 0px -60% 0px" },
);

document.querySelectorAll("main section").forEach((section) => {
  sectionObserver.observe(section);
});
