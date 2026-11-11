/* Landing-page display mode, demo registration, and section navigation. */
const themeButton = document.getElementById('theme');
themeButton.addEventListener('click', () => {
  const isColorPreview = document.body.classList.toggle('brand');
  themeButton.setAttribute('aria-pressed', String(isColorPreview));
  themeButton.textContent = isColorPreview
    ? 'Return to grayscale wireframe'
    : 'Preview campaign colors';
});

const signupDialog = document.getElementById('signup');
document.getElementById('rsvp').addEventListener('click', () => {
  signupDialog.showModal();
});
document.getElementById('close').addEventListener('click', () => {
  signupDialog.close();
});
document.getElementById('form').addEventListener('submit', (event) => {
  event.preventDefault();
  document.getElementById('confirmation').textContent =
    'Preview complete. In the live site, this step would confirm registration ' +
    'and explain when meeting details will arrive. Nothing was submitted.';
  document.getElementById('email').value = '';
});

const sectionObserver = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    document.querySelectorAll('nav .links a').forEach((link) => {
      if (link.hash === `#${entry.target.id}`) {
        link.setAttribute('aria-current', 'location');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }
}, { rootMargin: '-20% 0px -60% 0px' });

document.querySelectorAll('main section').forEach((section) => {
  sectionObserver.observe(section);
});
