const toggleMenu = function toggleMenuFnc() {
  document.getElementById('navbarBurger').classList.toggle('is-active');
  document.getElementById('navbarMenu').classList.toggle('is-active');
};

document.addEventListener('DOMContentLoaded', () => {
  const navbarBurgerButton = document.getElementById('navbarBurger');

  navbarBurgerButton.addEventListener('click', toggleMenu);
});

