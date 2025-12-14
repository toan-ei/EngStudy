import { loadConfig } from "./configloader.js";
const config = await loadConfig();

const level = localStorage.getItem("selectedLevel");
const language = localStorage.getItem("language");
const localLanguage = localStorage.getItem("localLanguage");
const containerLesson = document.getElementById('containerLesson');

let page = 1;
let size = 100;

console.log("i selected level: ", level);
console.log("i selected language: ", language);
console.log("i selected local language: ", localLanguage);
if (level) {
    document.querySelector(".name-feature").textContent = "Translate - " + level + "/" + language;
}

function getTranslates() {
    const token = localStorage.getItem('token');
    fetch(`${config.api.getTranslate}${level}/${localLanguage}?page=${page}&size=${size}`, {
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            data.result.data.map(dataTranslate => {
                const button = document.createElement('button');
                button.id = dataTranslate.translateId;
                button.textContent = dataTranslate.nameLesson;
                containerLesson.appendChild(button);
            })
        })
}


getTranslates();

containerLesson.addEventListener("click", (event) => {
    const btn = event.target;

    if (btn.tagName === "BUTTON") {
        const lessonId = btn.id;
        const lessonName = btn.textContent;

        console.log("Selected lesson ID:", lessonId);
        console.log("Selected lesson name:", lessonName);

        localStorage.setItem("selectedLessonId", lessonId);
        localStorage.setItem("selectedLessonName", lessonName);
        window.location.href = "Translate.html"
    }
});


