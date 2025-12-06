function logoutAplication(){
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    window.location.href = 'Login.html';
}



window.addEventListener("DOMContentLoaded", () => {
    console.log("token\n:", localStorage.getItem('token'));
    console.log("userId\n:", localStorage.getItem('userId'));
    const extensionIcon = document.getElementById('extension-icon');
    const list = document.querySelector('.list');
    list.style.display = 'none';
    extensionIcon.onclick = () => {
        list.style.display = 'block';
    }
    document.addEventListener("click", (e) => {
        if(list.style.display === 'block' 
            && !list.contains(e.target) 
            && e.target !== extensionIcon)
            {
                list.style.display = 'none';
            }
    });


    // logout
    const logout = document.getElementById('logout');
    logout.onclick = () => {
        console.log(1);
        logoutAplication();
    }

    const btnVocabulary = document.getElementById('vocabulary');
    const btnTranslate = document.getElementById('translate')
    const btnListening = document.getElementById('listening');
    btnVocabulary.onclick = ()=> {
        window.location.href = 'VocabularyChooseLevel.html';
    }
    btnTranslate.onclick = () => {
        window.location.href = 'TranslateChooseLevel.html';
    }
    btnListening.onclick = () =>{
        window.location.href = 'ListeningChooseTopic.html';
    }
})


