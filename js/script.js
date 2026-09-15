// Navmenu toggle
const toggleBtn = document.querySelector('.mobile-menu-toggle');

toggleBtn.addEventListener('click', function() {
    const menu = document.querySelector('.mobile-menu-list');
    menu.classList.toggle('show');
});


const loggedIn = true;

if (loggedIn) {
    console.log('User is logged in');
    document.querySelector('.nav-content > .nav-buttons .btn-register').style.display = 'none';
    document.querySelector('.nav-content > .nav-mobile-menu .btn-register').style.display = 'none';
    document.querySelector('.nav-content > .nav-buttons .btn-signin').style.display = 'none';
    document.querySelector('.nav-content > .nav-mobile-menu .btn-signin').style.display = 'none';
    document.querySelector('.nav-content > .nav-buttons .btn-notification').style.display = 'block';
    document.querySelector('.nav-content > .nav-buttons .btn-profile').style.display = 'block';
}