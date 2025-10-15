/*
// (Exemple de gestion des skip links si besoin)
document.querySelectorAll('.skip-links a').forEach(link => {
  link.addEventListener('focus', () => {
    link.removeAttribute('aria-hidden');
  });
  link.addEventListener('blur', () => {
    link.setAttribute('aria-hidden', 'true');
  });
});
*/

  // Écran de chargement / éviter le flash pendant l'injection header/footer
document.body.style.visibility = 'hidden';

// ---- utilitaire : init du bouton contraste élevé ----
function initContrastToggle() {
  const btn = document.getElementById("toggle-contrast");
  if (!btn) return;

  // Rétablir l’état mémorisé
  const saved = localStorage.getItem("contrast") === "true";
  document.body.classList.toggle("contrast", saved);
  btn.setAttribute("aria-pressed", String(saved));

  // Bascule au clic
  btn.addEventListener("click", () => {
    const next = !document.body.classList.contains("contrast");
    document.body.classList.toggle("contrast", next);
    btn.setAttribute("aria-pressed", String(next));
    localStorage.setItem("contrast", String(next));
  });
}

// Injection du header et du footer
Promise.all([
  fetch('header.html').then(response => response.text()).then(data => {
    document.body.insertAdjacentHTML('afterbegin', data);
  }),
  fetch('footer.html').then(response => response.text()).then(data => {
    document.body.insertAdjacentHTML('beforeend', data);
  })
]).then(() => {
  const loader = document.getElementById('loader');
  if (loader) {
    loader.style.display = 'none';
  }

  // Mettre en surbrillance l'onglet actif dans le menu de navigation
  const navContainer = document.getElementById('navigation-principale');
  if (navContainer) {
    const navLinks = navContainer.querySelectorAll('a');
    const currentUrl = window.location.pathname;

    navLinks.forEach(link => {
      const linkPath = new URL(link.getAttribute('href'), window.location.origin)
        .pathname
        .replace(/^\.\//, '/');
      if (currentUrl === linkPath) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  // ⚡️ initialiser le bouton contraste APRÈS injection du header
  initContrastToggle();

  // Rendre la page visible après l'injection
  document.body.style.visibility = 'visible';
});

// Gestion de la soumission du formulaire de contact (sécurisée)
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const formulaire = event.target;
    formulaire.innerHTML = '<p id="remerciement" tabindex="0">Merci de nous avoir contacté. Nos équipes mettent tout en œuvre pour vous répondre au plus vite.</p>';

    // Scroller jusqu'à la section de remerciement
    const remerciementSection = document.getElementById('titre-formulaire');
    if (remerciementSection) {
      remerciementSection.scrollIntoView({ behavior: 'smooth' });
    }
  });
}

/*
// Gestion du défilement pour la navigation principale
document.addEventListener('scroll', () => {
  const menu = document.getElementById('navigation-principale');
  const headerHeight = document.querySelector('header').offsetHeight;

  if (window.scrollY > headerHeight) {
    menu.style.position = 'fixed';
  } else {
    menu.style.position = 'static';
  }
});
*/

