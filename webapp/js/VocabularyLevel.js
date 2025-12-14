
function getVocabulary(level) {
    let levelInput = level;
    const token = localStorage.getItem('token');
    fetch(`http://localhost:8080/identity/vocabylaries/level/${levelInput}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        console.log("data\n", data);
        const questions = data.result.filter(item => !item.deleted).map(item => ({
            id: item.vocabularyId,
            word: item.word,
            answer: "",
            meanings: item.meanings.filter(m => !m.deleted).map(m => m.meaning)
        }))
        localStorage.setItem("questions", JSON.stringify(questions))
        window.location.href = `Vocabulary.html?level=${level}`;
    })
    .catch(err => {
        console.error("Error:", err);
    });
}



window.addEventListener("DOMContentLoaded", () => {
    const btnA1 = document.getElementById('A1');
    const btnA2 = document.getElementById('A2');
    const btnB1 = document.getElementById('B1');
    const btnB2 = document.getElementById('B2');
    const btnC1 = document.getElementById('C1');
    const btnC2 = document.getElementById('C2');

    btnA1.onclick = () => {
        getVocabulary("A1")
    }
    btnA2.onclick = () => {
        getVocabulary("A2")
    }
    btnB1.onclick =  () => {
        getVocabulary("B1")
    }
    btnB2.onclick = async () => {
        getVocabulary("B2")
    }
    btnC1.onclick = () => {
        getVocabulary("C1")
    }
    btnC2.onclick = async () => {
        getVocabulary("C2")
    }
})
