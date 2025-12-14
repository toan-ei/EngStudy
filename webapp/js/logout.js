import { loadConfig } from "./configloader.js";
const config = await loadConfig();


function logoutAplication() {
    const token = localStorage.getItem('token');
    const dataRequest = {
        "token": token
    }
    fetch(config.api.logout, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataRequest)
    })
        .then((response) => {
            return response.json();
        })
        .catch((err) => {
            alert("error during logout")
            console.log("error during logout: \n", err);
        })

    localStorage.clear();
    window.location.href = 'Login.html';
}

const logout = document.getElementById('logout');
logout.onclick = () => {
    logoutAplication();
}