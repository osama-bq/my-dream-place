// Navmenu toggle
const toggleBtn = document.querySelector('.mobile-menu-toggle');

toggleBtn.addEventListener('click', function() {
    const menu = document.querySelector('.mobile-menu-list');
    menu.classList.toggle('show');
});