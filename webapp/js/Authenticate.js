async function handleCallback(){ 
    console.log(window.location.href);

    const authCodeRegex = /code=([^&]+)/;
    const isMatch = window.location.href.match(authCodeRegex);

    if (isMatch) {
      const authCode = isMatch[1];

      fetch(
        `http://localhost:8080/identity/authentication/outbound/authentication?code=${authCode}`,
        {
          method: "POST",
        }
      )
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          console.log(data);

          localStorage.setItem('token', data.result.token);
          localStorage.setItem('userId', data.result.userId);
          window.location.href = "home.html"; 
        })
        .catch((err) => {
            alert("loi");
            console.log("error when login via google: \n", err);
        })
    }
}

window.addEventListener("DOMContentLoaded", () => {
    handleCallback();
});

