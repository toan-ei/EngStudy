
document.addEventListener("DOMContentLoaded", function () {
    const avatar = document.getElementById('avatar-preview');
    const saved = localStorage.getItem('urlAvatar');
    console.log("saved avatar: \n", saved);
    if (saved) {
        avatar.src = saved;
    }
});