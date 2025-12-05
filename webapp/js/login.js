const ApiLogin = "http://localhost:8080/identity/authentication/login";
const ApiRegister = "http://localhost:8080/identity/users";

function login(email, password){
    if(!email || !password){
        alert("vui lòng nhập đầy đủ email and password!")
        return;
    }

    const isGmail = (email) => email.endsWith("@gmail.com");
    if(!isGmail(email)) {
        alert("vui lòng nhập đúng đuôi gmail!");
        return;
    }

    const data = {
        "gmail": email,
        "password": password
    };
    fetch(ApiLogin, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    })
    .then((data) => {
        return data.json();
    })
    .then((response) => {
        const token = response.result.token;
        const userId = response.result.userId;
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);
        window.location.href = "home.html";
    })
    .catch((err) => {
        console.log("loi dang nhap: ", err);
    })
}

function register(email, password){
    if(!email || !password){
        alert("vui lòng nhập đầy đủ email and password!")
        return;
    }
    const isGmail = (email) => email.endsWith("@gmail.com");
    if(!isGmail(email)) {
        alert("vui lòng nhập đúng đuôi gmail!");
        return;
    }
    if(password.length < 5){
        alert("password phải nhiều hơn 6 kí tự");
        return;
    }
    const data = {
        "gmail": email,
        "password": password
    };
    fetch(ApiRegister, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    })
    .then((data) => {
        return data.json();
    })
    .then((response) => {
        console.log("register has been success");
        const containerRegister = document.querySelector(".container-register");
        containerRegister.style.display = 'none';
    })
    .catch((err) => {
        console.log("loi dang nhap: ", err);
    })
}


window.addEventListener("DOMContentLoaded", () => {
    //login
    const BtnLogin = document.getElementById("login-submit");
    BtnLogin.onclick = () => {
        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;
        login(email, password);
    }
    // register
    const createNewAccount = document.getElementById("create-new-account");
    const containerRegister = document.querySelector(".container-register");
    containerRegister.style.display = 'none';
    createNewAccount.onclick = () => {
        containerRegister.style.display = 'block';
    }
    document.addEventListener("click", (e) => {
        if(containerRegister.style.display === 'block' 
            && !containerRegister.contains(e.target) 
            && e.target !== createNewAccount)
            {
                containerRegister.style.display = 'none';
            }
    });

    const btnRegister = document.getElementById('register-submit');
    btnRegister.onclick = () => {
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        register(email, password);
    }

})

document.querySelectorAll(".togglePassword").forEach(btn => {
    btn.addEventListener("click", () => {
        const input = btn.previousElementSibling;
        input.type = input.type === "password" ? "text" : "password";
    });
});
