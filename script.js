/* --------------------------------------------
   BMVR Nice – script principal
   -------------------------------------------- */

(() => {
  'use strict';

  // Masquer la page pendant l'injection du header/footer
  document.body.style.visibility = 'hidden';

  /* --------------------------------------------
     Utilitaires
     -------------------------------------------- */

  // Normalise un chemin pour comparer deux URLs de page:
  // - retire "index.html"
  // - retire les slashs finaux
  // - ignore query & hash
  const normalizePath = (u) => {
    const url = new URL(u, document.baseURI);
    let p = url.pathname.replace(/\/index\.html$/i, '/');
    if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
    return p || '/';
  };

  // Met en surbrillance le lien courant dans la nav
  const highlightCurrentNav = () => {
    const navContainer = document.getElementById('navigation-principale');
    if (!navContainer) return;

    const here = normalizePath(window.location.href);

    navContainer.querySelectorAll('a[href]').forEach((link) => {
      const href = link.getAttribute('href');

      // Ignorer ancres pures et liens externes
      if (!href || href.startsWith('#')) return;
      const isExternal = /^https?:\/\//i.test(href) && !href.startsWith(window.location.origin);
      if (isExternal) return;

      const target = normalizePath(href);

      // Match strict après normalisation
      if (target === here) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  // Bascule contraste élevé (persistée)
  const initContrastToggle = () => {
    const btn = document.getElementById('toggle-contrast');
    if (!btn) return;

    // Rétablir état mémorisé
    const saved = localStorage.getItem('contrast') === 'true';
    document.body.classList.toggle('contrast', saved);
    btn.setAttribute('aria-pressed', String(saved));

    // Clic
    btn.addEventListener('click', () => {
      const next = !document.body.classList.contains('contrast');
      document.body.classList.toggle('contrast', next);
      btn.setAttribute('aria-pressed', String(next));
      localStorage.setItem('contrast', String(next));
    });
  };

  // Formulaire de contact
  const initContactForm = () => {
    const contactForm = document.querySelector('.contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function (event) {
      event.preventDefault();

      const formulaire = event.target;
      formulaire.innerHTML =
        '<p id="remerciement" tabindex="0">Merci de nous avoir contacté. Nos équipes mettent tout en œuvre pour vous répondre au plus vite.</p>';

      const remerciementSection = document.getElementById('titre-formulaire');
      if (remerciementSection) {
        remerciementSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  };

  /* --------------------------------------------
     Injection header/footer puis initialisations
     -------------------------------------------- */

  const injectFragments = () => {
    const injectHeader = fetch('header.html')
      .then((r) => {
        if (!r.ok) throw new Error('header.html introuvable');
        return r.text();
      })
      .then((html) => {
        document.body.insertAdjacentHTML('afterbegin', html);
      });

    const injectFooter = fetch('footer.html')
      .then((r) => {
        if (!r.ok) throw new Error('footer.html introuvable');
        return r.text();
      })
      .then((html) => {
        document.body.insertAdjacentHTML('beforeend', html);
      });

    return Promise.allSettled([injectHeader, injectFooter]);
  };

  const start = () => {
    // Si le DOM n'est pas prêt, attendre
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', start, { once: true });
      return;
    }

    injectFragments()
      .then(() => {
        // Après injection : initialiser fonctionnalités dépendantes du header
        highlightCurrentNav();
        initContrastToggle();
      })
      .catch((err) => {
        // On loggue mais on continue (ne pas bloquer l'affichage)
        console.error('[BMVR] Erreur d’injection :', err);
      })
      .finally(() => {
        // Initialisations qui ne dépendent pas du header/footer
        initContactForm();

        // Toujours rendre visible, même en cas d’erreur de fetch
        document.body.style.visibility = 'visible';
      });
  };

  // Démarrage
  start();

  /* --------------------------------------------
     (Optionnel) Gestion skip-links si besoin
     --------------------------------------------
  // document.querySelectorAll('.skip-links a').forEach((link) => {
  //   link.addEventListener('focus', () => link.removeAttribute('aria-hidden'));
  //   link.addEventListener('blur', () => link.setAttribute('aria-hidden', 'true'));
  // });
  */
})();
