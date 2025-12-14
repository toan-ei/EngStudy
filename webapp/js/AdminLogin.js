import { loadConfig } from "./configloader.js";
const config = await loadConfig();

function login(){
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if(username.includes("@")){
        alert("username or password sai");
        return;
    }

    const dataRequest = {
        "gmail": username,
        "password": password
    }

    fetch(config.api.login, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataRequest)
    })
    .then((response) => {
        return response.json()
    })
    .then((data) => {
        localStorage.setItem('tokenAdmin', data.result.token);
        window.location.href = "AdminDashboard.html";
    })
    .catch((err) => {
        alert("loi");
        console.log("err\n", err);
    })
}

const btnLogin = document.getElementById('login');
btnLogin.onclick = () => {
    login();
}