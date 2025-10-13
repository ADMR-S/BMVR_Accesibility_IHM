/*
document.querySelectorAll('.skip-links a').forEach(link => {
  link.addEventListener('focus', () => {
    link.removeAttribute('aria-hidden');
  });
  link.addEventListener('blur', () => {
    link.setAttribute('aria-hidden', 'true');
  });
});
*/



// Ajouter un écran de chargement avant l'injection du header et du footer
document.body.style.visibility = 'hidden';

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
    const navLinks = navContainer.querySelectorAll('a'); // Sélectionner tous les liens dans la navigation
    const currentUrl = window.location.pathname;

    navLinks.forEach(link => {
        // Normaliser le chemin du lien pour correspondre à l'URL actuelle
        const linkPath = new URL(link.getAttribute('href'), window.location.origin).pathname.replace(/^\\.\//, '/');
        if (currentUrl === linkPath) {
            link.setAttribute('aria-current', 'page');
        } else {
            link.removeAttribute('aria-current');
        }
    });

    // Rendre la page visible après l'injection du header et du footer
    document.body.style.visibility = 'visible';
});

// Gestion de la soumission du formulaire de contact
document.querySelector('.contact-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const formulaire = event.target;
    formulaire.innerHTML = '<p id="remerciement">Merci de nous avoir contacté. Nos équipes mettent tout en œuvre pour vous répondre au plus vite.</p>';

    // Scroller jusqu'à la section de remerciement
    const remerciementSection = document.getElementById('titre-formulaire');
    if (remerciementSection) {
        remerciementSection.scrollIntoView({ behavior: 'smooth' });
    }
});

