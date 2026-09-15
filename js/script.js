// Navmenu toggle
const toggleBtn = document.querySelector('.mobile-menu-toggle');

if (toggleBtn) {
    toggleBtn.addEventListener('click', function() {
        const menu = document.querySelector('.mobile-menu-list');
        menu.classList.toggle('show');
    });
}


const searchBar = document.querySelector('.search-bar');
console.log(searchBar);
searchBar?.querySelectorAll('input').forEach(input => {
    input.addEventListener('change', event => {
        let target = event.target;
        if (target.value.trim() !== '') {
            target.classList.add('has-value');
        } else {
            target.classList.remove('has-value');
        }
    });
});


const loggedIn = true;

if (loggedIn) {
    console.log('User is logged in');
    document.querySelector('.nav-content > .nav-buttons .btn-register').style.display = 'none';
    if (document.querySelector('.nav-content > .nav-mobile-menu')) {
        document.querySelector('.nav-content > .nav-mobile-menu .btn-register').style.display = 'none';
        document.querySelector('.nav-content > .nav-mobile-menu .btn-signin').style.display = 'none';
    }
    document.querySelector('.nav-content > .nav-buttons .btn-signin').style.display = 'none';
    document.querySelector('.nav-content > .nav-buttons .btn-notification').style.display = 'block';
    document.querySelector('.nav-content > .nav-buttons .btn-profile').style.display = 'block';
}