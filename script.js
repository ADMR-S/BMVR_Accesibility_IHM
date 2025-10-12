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



fetch('header.html')
    .then(response => response.text())
    .then(data => {
        document.body.insertAdjacentHTML('afterbegin', data);
    });
fetch('footer.html')
    .then(response => response.text())
    .then(data => {
        document.body.insertAdjacentHTML('beforeend', data);
    });