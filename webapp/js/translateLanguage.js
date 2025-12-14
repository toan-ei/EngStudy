const level = localStorage.getItem("selectedLevel");
console.log("i selected level: ", level);
if (level) {
    document.querySelector(".name-feature").textContent = "Translate - " + level;
}


document.getElementById('extension-icon').addEventListener('click', function (e) {
    e.stopPropagation();
    const list = this.parentElement.querySelector('.list');
    list.style.display = list.style.display === 'block' ? 'none' : 'block';
});

document.addEventListener('click', function () {
    const lists = document.querySelectorAll('.list');
    lists.forEach(list => list.style.display = 'none');
});

document.querySelectorAll('.language-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        document.querySelectorAll('.language-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
    });
});


const languageVIDiv = document.getElementById("VI-lg");
const languageENDiv = document.getElementById("EN-lg");

languageVIDiv.addEventListener('click', function(){
    localStorage.setItem("language", "VI");
    localStorage.setItem("localLanguage", "EN");
    window.location.href = "TranslateChooseLesson.html";
})

languageENDiv.addEventListener('click', function() {
    localStorage.setItem("language", "EN");
    localStorage.setItem("localLanguage", "VI");
    window.location.href = "TranslateChooseLesson.html";
})



