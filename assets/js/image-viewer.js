// Enlarge local campaign images without navigating away from the website.
(() => {
  const viewer = document.querySelector(".image-viewer");
  if (!viewer || !viewer.showModal) return;
  const image = viewer.querySelector("img");
  const close = viewer.querySelector("button");
  let opener;
  let previousOverflow;
  document.querySelectorAll("a[href]").forEach((link) => {
    if (
      !/\.(png|jpe?g|webp|svg)(?:[?#].*)?$/i.test(link.getAttribute("href")) ||
      !link.querySelector("img")
    )
      return;
    link.removeAttribute("target");
    link.setAttribute("aria-haspopup", "dialog");
    link.addEventListener("click", (event) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)
        return;
      event.preventDefault();
      opener = link;
      image.src = link.href;
      image.alt = link.querySelector("img").alt;
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      viewer.showModal();
      close.focus();
    });
  });
  close.addEventListener("click", () => viewer.close());
  viewer.addEventListener("click", (event) => {
    if (event.target === viewer) viewer.close();
  });
  viewer.addEventListener("close", () => {
    document.body.style.overflow = previousOverflow || "";
    image.removeAttribute("src");
    opener?.focus({ preventScroll: true });
  });
})();
