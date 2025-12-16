import { loadConfig } from "./configloader.js";
const config = await loadConfig();

const contentLocalDiv = document.getElementById('contentLocal');
const submitBtn = document.getElementById("submit");
const translatedText = document.querySelector('.vietnamese-text p');
let paragraph = '';


function getTranslate() {
    const translateId = localStorage.getItem('selectedLessonId');
    const token = localStorage.getItem('token');
    console.log("token: \n", token)
    fetch(`${config.api.getTranslateViaTranslateId}${translateId}`, {
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            console.log("data: \n", data);
            const p = document.createElement('p');
            p.textContent = data.result.paragraph;
            paragraph = data.result.paragraph;
            contentLocalDiv.appendChild(p);
        })
        .catch((err) => {
            alert("error when get translate via translateId");
            console.log("error when get translate via translateId: \n", err);
        })
}

function showLoading() {
    document.getElementById('loadingOverlay').classList.add('active');
}

function hideLoading() {
    document.getElementById('loadingOverlay').classList.remove('active');
}


async function askAIByLanguageVietnamese(userText) {
    const dataRequest = {
        "paragraphLgEnglish": paragraph,
        "paragraphLgVietnamese": userText
    }
    console.log("data request: \n", dataRequest)
    const token = localStorage.getItem('token');
    showLoading()
    try {
        const response = await fetch(config.api.fixParagraphWithVietnamese, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dataRequest)
        })
        const data = await response.json();
        translatedText.innerHTML = `<h2>Kết quả</h2>` + marked.parse(data.result.message);

    } catch (error) {
        alert("loi");
    } finally{
        hideLoading();
    }
}

async function askAIByLanguagEnglish(userText) {
    const dataRequest = {
        "paragraphLgEnglish": userText,
        "paragraphLgVietnamese": paragraph
    }
    console.log("data request: \n", dataRequest)
    const token = localStorage.getItem('token');
    showLoading()
    try {
        const response = await fetch(config.api.fixParagraphWithEnglish, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dataRequest)
        })
        const data = await response.json();
        translatedText.innerHTML = `<h2>Kết quả</h2>` + marked.parse(data.result.message);

    } catch (error) {
        alert("loi");
    } finally{
        hideLoading();
    }
}

submitBtn.addEventListener('click', () => {
    const userText = translatedText.textContent.trim();
    console.log("user text: \n", userText);
    const languageTranslate = localStorage.getItem('language');

    if (languageTranslate === "VI") {
        askAIByLanguageVietnamese(userText);
    }
    else if (languageTranslate === "EN") {
        askAIByLanguagEnglish(userText);
    }
    else {
        alert('language khong ton tai')
    }
    submitBtn.disabled = true;
    submitBtn.textContent = 'Đã nộp';
});

getTranslate();

const extensionIcon = document.getElementById('extension-icon');
extensionIcon.addEventListener('click', function (e) {
    e.stopPropagation();
    const list = this.parentElement.querySelector('.list');
    list.style.display = list.style.display === 'block' ? 'none' : 'block';
});
document.addEventListener('click', function () {
    document.querySelectorAll('.list').forEach(list => list.style.display = 'none');
});
