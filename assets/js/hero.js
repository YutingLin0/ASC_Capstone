/* Four illustrative destinations; no live transit or geographic routing claims. */
const heroDestinations = {
  work: {
    title: "A new\nopportunity.",
    tag: "GETTING TO WORK",
    color: "#f49c1e",
    copy: "An accessible walk to the bus and a connection to rail can link a neighborhood to more places to work.",
  },
  learn: {
    title: "Room\nto grow.",
    tag: "GETTING TO SCHOOL",
    color: "#9fd3a6",
    copy: "Connected sidewalks, transit stops, and stations can help students reach classes, libraries, and opportunities to learn.",
  },
  care: {
    title: "Care within\nreach.",
    tag: "REACHING AN APPOINTMENT",
    color: "#b1daf4",
    copy: "Safer crossings and accessible transfers can help make the journey to healthcare easier to navigate.",
  },
  connect: {
    title: "More time\ntogether.",
    tag: "CONNECTING WITH COMMUNITY",
    color: "#c5c2eb",
    copy: "Better links between walking, cycling, and transit can help people reach friends, family, and neighborhood life.",
  },
};
const explorer = document.querySelector(".destination-explorer");
const destinationLabels = [...document.querySelectorAll("[data-destination]")];
function selectDestination(key) {
  const destination = heroDestinations[key];
  if (!destination || !explorer) return;
  destinationLabels.forEach((label) => {
    if (label.dataset.destination === key)
      label.setAttribute("aria-current", "step");
    else label.removeAttribute("aria-current");
  });
  const title = document.getElementById("destination-title");
  title.replaceChildren(
    ...destination.title
      .split("\n")
      .flatMap((line, index) =>
        index
          ? [document.createElement("br"), document.createTextNode(line)]
          : [document.createTextNode(line)],
      ),
  );
  document.getElementById("destination-tag").textContent = destination.tag;
  document.getElementById("destination-copy").textContent = destination.copy;
  const number = String(
    Object.keys(heroDestinations).indexOf(key) + 1,
  ).padStart(2, "0");
  document.getElementById("connection-number").textContent = number;
  document.querySelector(".explorer-index").textContent = `${number} / 04`;
  explorer.style.setProperty("--destination-color", destination.color);
  const card = explorer.querySelector(".destination-card");
  card.dataset.illustration = {
    work: "bus",
    learn: "walk",
    care: "access",
    connect: "walk",
  }[key];
  card.classList.remove("arriving");
  requestAnimationFrame(() => card.classList.add("arriving"));
}

// Automatic rotation pauses outside the viewport, in background tabs, or on request.
const destinationOrder = Object.keys(heroDestinations);
const motionPreference = matchMedia("(prefers-reduced-motion: reduce)");
const motionToggle = document.getElementById("hero-motion-toggle");
let destinationIndex = 0;
let rotationTimer = null;
let transitionTimer = null;
let userPaused = false;
let inView = true;
function stopRotation() {
  clearTimeout(rotationTimer);
  clearTimeout(transitionTimer);
  explorer.classList.remove("changing");
}
function scheduleRotation() {
  stopRotation();
  if (userPaused || motionPreference.matches || document.hidden || !inView)
    return;
  rotationTimer = setTimeout(() => {
    explorer.classList.add("changing");
    transitionTimer = setTimeout(() => {
      destinationIndex = (destinationIndex + 1) % destinationOrder.length;
      selectDestination(destinationOrder[destinationIndex]);
      explorer.classList.remove("changing");
      scheduleRotation();
    }, 300);
  }, 4700);
}
motionToggle.addEventListener("click", () => {
  userPaused = !userPaused;
  motionToggle.setAttribute("aria-pressed", String(userPaused));
  motionToggle.textContent = userPaused
    ? "Resume animation"
    : "Pause animation";
  scheduleRotation();
});
function updateMotionPreference() {
  motionToggle.hidden = motionPreference.matches;
  scheduleRotation();
}
motionPreference.addEventListener("change", updateMotionPreference);
document.addEventListener("visibilitychange", scheduleRotation);
new IntersectionObserver(
  (entries) => {
    inView = entries[0].isIntersecting;
    scheduleRotation();
  },
  { threshold: 0.1 },
).observe(explorer);
selectDestination(destinationOrder[0]);
updateMotionPreference();
