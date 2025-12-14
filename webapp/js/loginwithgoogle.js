const clientId = '943916895240-k6qc7q7gkjojfk8174nr35c5fsuogdfn.apps.googleusercontent.com';
const redirectUri = 'http://127.0.0.1:5500/webapp/html/Authenticate.html';
const authUrl = 'https://accounts.google.com/o/oauth2/auth';

function loginWithGoogle(){
    const targetUrl = `${authUrl}?redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=code&client_id=${clientId}&scope=openid%20email%20profile`;

    window.location.href = targetUrl;
}

window.addEventListener("DOMContentLoaded", () => {
    const BtnLogin = document.getElementById("loginViaGoogle");
    if (BtnLogin) {
        BtnLogin.onclick = () => {
            loginWithGoogle();
        }
    }
});