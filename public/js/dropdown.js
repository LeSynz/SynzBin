const menuButton = document.getElementById('user-menu-button');
const dropdown = document.getElementById('user-dropdown');

if (menuButton && dropdown) {
    menuButton.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('hidden');
    });

    document.addEventListener('click', (e) => {
        if (!dropdown.classList.contains('hidden') && !dropdown.contains(e.target)) {
            dropdown.classList.add('hidden');
        }
    });
}