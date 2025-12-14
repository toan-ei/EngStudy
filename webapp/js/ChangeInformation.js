import { loadConfig } from "./configloader.js";
const config = await loadConfig();

let selectedFile = null; 
const profile = JSON.parse(localStorage.getItem('profile'));
console.log("profile\n",profile);

document.getElementById('avatarInput').addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (file) {
        selectedFile = file;
        
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = document.getElementById('avatarImage');
            img.src = e.target.result;
            img.classList.add('show');
            document.querySelector('.avatar-placeholder').style.display = 'none';
        };
        reader.readAsDataURL(file);
    }
});

async function uploadAvatar() {
    if (!selectedFile) {
        return null;
    }

    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('media', selectedFile); 

    try {
        const response = await fetch(config.api.uploadFile, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        });

        const result = await response.json();
        return result.result.url; 
    } catch (error) {
        console.error("Error uploading avatar:", error);
        return null;
    }
}

async function updateInformation() {
    const fullName = document.getElementById('fullname').value;
    const numberPhone = document.getElementById('numberphone').value;
    const address = document.getElementById('address').value;
    const dob = document.getElementById('dob').value;

    console.log("dob", dob);



    const token = localStorage.getItem('token');
    const profileId = profile.profileId;

    let avatarUrl = "";
    if (selectedFile) {
        avatarUrl = await uploadAvatar();
        if (!avatarUrl) {
            alert("Failed to upload avatar!");
            return;
        }
    }

    if(avatarUrl === ""){
        avatarUrl = profile.avatar;
    }

    const dataRequest = {
        "fullName": fullName,
        "numberPhone": numberPhone,
        "avatar": avatarUrl,
        "address": address,
        "dob": dob
    };

    try {
        const response = await fetch(config.api.updateProfile + profileId, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dataRequest)
        });

        const result = await response.json();
        
        if (response.ok) {
            alert("Profile updated successfully!");
            console.log("Result:", result);
            localStorage.setItem('profile', JSON.stringify(result.result));
        } else {
            alert("Failed to update profile!");
        }
    } catch (error) {
        console.error("Error updating profile:", error);
        alert("Error updating profile!");
    }
}

function defaultData(){
    const fullName = document.getElementById('fullname');
    const numberPhone = document.getElementById('numberphone');
    const address = document.getElementById('address');
    const dob = document.getElementById('dob');

    fullName.value = profile.fullName || '';
    numberPhone.value = profile.numberPhone || '';
    address.value = profile.address || ''; 
    dob.value = profile.dob || '';

    const avatarImage = document.getElementById('avatarImage');
    const avatarPlaceholder = document.querySelector('.avatar-placeholder');
    
    if (profile.avatar && profile.avatar !== '') {
        avatarImage.src = profile.avatar;
        avatarImage.classList.add('show');
        avatarPlaceholder.style.display = 'none';
    } else {
        avatarImage.classList.remove('show');
        avatarImage.src = '';
        avatarPlaceholder.style.display = 'block';
    }
}

defaultData();

document.getElementById('userInfoForm').addEventListener('submit', function (e) {
    e.preventDefault();
    updateInformation();
});

document.querySelector('.cancel-btn').addEventListener('click', function () {
    window.history.back();
});