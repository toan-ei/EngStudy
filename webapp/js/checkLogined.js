import { loadConfig } from "./configloader.js";
const config = await loadConfig();


// chua xu li truong hop con thoi gian reset.

function check(){
    let token = localStorage.getItem('token') || null;
    if(token == null){
        alert("vui long dang nhap lai")
        window.location.href = "login.html";
    }
    let dataRequest = {
        token: token
    }
    fetch(config.api.checkToken, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(dataRequest)
    })
    .then((response) => {
        return response.json()
    })
    .then((data) => {
        if(data.result.valid == false){
            localStorage.removeItem('token');
            alert("vui long dang nhap lai")
            window.location.href = "login.html";
        }
    })
}

check();

// part dropdown

const changeInformation = document.getElementById('change-information');
changeInformation.onclick = () =>{
    window.location.href = "ChangeInformation.html";
}

