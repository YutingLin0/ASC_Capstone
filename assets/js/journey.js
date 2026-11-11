/* Reusable journey component: include once on any page with #mode-panel. */
const modes = {
  "walk": [
    "Walk: the connection begins here.",
    "The trip to a stop or station is part of the journey. Wider, accessible sidewalks, safer crossings, and lighting can make that first connection easier to navigate.",
    "Investment → safer walking access → a better connection to transit."
  ],
  "bus": [
    "Bus: bring neighborhoods into the network.",
    "Local and regional bus routes connect neighborhoods to destinations and rail. Accessible stops and reliable service help people move between stages of a trip.",
    "Investment → accessible stops and better connections → an easier transfer."
  ],
  "rail": [
    "Rail: connect to a wider region.",
    "Commuter and regional rail connect people to key destinations. Accessible station approaches and connections to other modes help make the station part of a complete journey.",
    "Investment → accessible stations and approaches → stronger regional connections."
  ],
  "bike": [
    "Bike: connect the first and last mile.",
    "Protected bike lanes, safer intersections, and secure parking can help link homes and destinations to transit. The connection matters as much as the ride.",
    "Investment → safer cycling access and secure parking → a stronger link to transit."
  ]
};

function selectMode(key) {
  const panel = document.getElementById('mode-panel');
  const mode = modes[key];
  if (!panel || !mode) return;

  document.querySelectorAll('[data-mode]').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.mode === key));
  });

  const heading = document.createElement('h3');
  heading.textContent = mode[0];
  const description = document.createElement('p');
  description.textContent = mode[1];
  const connection = document.createElement('p');
  const emphasis = document.createElement('strong');
  emphasis.textContent = mode[2];
  connection.append(emphasis);
  const note = document.createElement('p');
  note.className = 'note';
  note.textContent = 'Adapted from the research brief and journey infographic. ' +
    'Describes potential benefits, not guaranteed project outcomes.';
  panel.replaceChildren(heading, description, connection, note);
}

document.querySelectorAll('[data-mode]').forEach((button) => {
  button.addEventListener('click', () => selectMode(button.dataset.mode));
});
selectMode('walk');
