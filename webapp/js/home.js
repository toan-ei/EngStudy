import { loadConfig } from "./configloader.js";
const config = await loadConfig();

async function updateInitialAvatar(profile, profileId) {
    const response = await fetch("../image/initialAvatar/initial-avatar.jpg");
    const blob = await response.blob();

    const file = new File([blob], "default.jpg", { type: "image/jpeg" });

    const formData = new FormData();
    formData.append("media", file);

    console.log("config: \n", config);
    const token = localStorage.getItem('token');

    const res = await fetch(config.api.uploadFile, {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData,
    });

    const data = await res.json();
    console.log(data);
    const newProfile = {
        "fullname": profile.fullname,
        "numberPhone": profile.numberPhone,
        "avatar": data.result.url,
        "address": profile.address,
        "dob": profile.dob
    };
    fetch(config.api.updateProfile + profileId, {
        method: "PUT",
        headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newProfile)
    })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            localStorage.setItem("urlAvatar", data.result.avatar);
            console.log("avatar: \n", data.result.avatar);
        })
        .catch((err) => {
            console.log("error when updateInitialAvatar: \n", err);
        })
}

async function checkAvatar() {
    try {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");

        const response = await fetch(config.api.getProfileFromUserId + userId, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) return;

        const data = await response.json();
        console.log("profile: \n", data.result)
        localStorage.setItem('profile', JSON.stringify(data.result))
        const profile = {
            "fullname": data.result.fullname,
            "numberPhone": data.result.numberPhone,
            "avatar": data.result.avatar,
            "address": data.result.address,
            "dob": data.result.dob
        };

        if (data.result.avatar === null || data.result.avatar === '') {
            console.log(2);
            await updateInitialAvatar(profile, data.result.profileId);
        }
        else {
            localStorage.setItem('urlAvatar', data.result.avatar);
        }
        
    } catch (err) {
        console.log("checkAvatar error:", err);
    }
}

console.log("token\n:", localStorage.getItem('token'));
console.log("userId\n:", localStorage.getItem('userId'));
checkAvatar();
const extensionIcon = document.getElementById('extension-icon');
const list = document.querySelector('.list');
list.style.display = 'none';
extensionIcon.onclick = () => {
    list.style.display = 'block';
}
document.addEventListener("click", (e) => {
    if (list.style.display === 'block'
        && !list.contains(e.target)
        && e.target !== extensionIcon) {
        list.style.display = 'none';
    }
});



const btnVocabulary = document.getElementById('vocabulary');
const btnTranslate = document.getElementById('translate')
const btnListening = document.getElementById('listening');
btnVocabulary.onclick = () => {
    window.location.href = 'VocabularyChooseLevel.html';
}
btnTranslate.onclick = () => {
    window.location.href = 'TranslateChooseLevel.html';
}
btnListening.onclick = () => {
    window.location.href = 'ListeningChooseLevel.html';
}


