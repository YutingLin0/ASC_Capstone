/* Compact navigation on small screens, preserving anchor navigation and focus. */
(() => {
  const button = document.querySelector(".nav-toggle");
  const header = document.querySelector(".campaign-header");
  const links = document.getElementById("campaign-links");
  function close() {
    header.classList.remove("menu-open");
    button.setAttribute("aria-expanded", "false");
  }
  button.addEventListener("click", () => {
    const open = header.classList.toggle("menu-open");
    button.setAttribute("aria-expanded", String(open));
  });
  links
    .querySelectorAll("a")
    .forEach((link) => link.addEventListener("click", close));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && header.classList.contains("menu-open")) {
      close();
      button.focus();
    }
  });
  matchMedia("(min-width: 981px)").addEventListener("change", close);
})();
