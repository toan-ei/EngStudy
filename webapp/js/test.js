// Submit all answers
document.getElementById('submit').addEventListener('click', () => {
    saveCurrentAnswer();

    // Check if all questions are answered
    const unanswered = userAnswers.filter(a => a === '').length;
    if (unanswered > 0) {
        if (!confirm(`You have ${unanswered} unanswered questions. Submit anyway?`)) {
            return;
        }
    }

    // Calculate results
    let correctCount = 0;
    const answersContainer = document.getElementById('answersContainer');
    answersContainer.innerHTML = '';

    vocabularyData.forEach((question, index) => {
        const userAnswer = userAnswers[index].toLowerCase().trim();
        const correctAnswers = question.answers.map(a => a.toLowerCase());
        const isCorrect = correctAnswers.includes(userAnswer);

        if (isCorrect) correctCount++;

        const answerDiv = document.createElement('div');
        answerDiv.className = `answer-item ${isCorrect ? 'correct' : 'incorrect'}`;
        answerDiv.innerHTML = `
                    <div class="answer-number">#${index + 1}</div>
                    <div class="answer-word">${question.word}</div>
                    <div class="answer-user">
                        <span class="answer-user-label">Your Answer:</span>
                        <span class="answer-user-text">${userAnswer || '(No answer)'}</span>
                    </div>
                    ${!isCorrect ? `
                    <div class="answer-correct">
                        <span class="answer-correct-label">Correct Answers:</span>
                        <span class="answer-correct-text">${correctAnswers.join(', ')}</span>
                    </div>
                    ` : '<div></div>'}
                    <div class="answer-status">${isCorrect ? '✓' : '✗'}</div>
                `;
        answersContainer.appendChild(answerDiv);
    });

    // Update result header
    const percentage = Math.round((correctCount / vocabularyData.length) * 100);
    document.getElementById('correctCount').textContent = correctCount;
    document.getElementById('resultPercentage').textContent = percentage + '%';

    const percentageEl = document.getElementById('resultPercentage');
    const messageEl = document.getElementById('resultMessage');

    if (percentage >= 80) {
        percentageEl.className = 'result-percentage pass';
        messageEl.textContent = 'Excellent! You did great! 🎉';
    } else if (percentage >= 60) {
        percentageEl.className = 'result-percentage pass';
        messageEl.textContent = 'Good job! Keep practicing! 👍';
    } else {
        percentageEl.className = 'result-percentage fail';
        messageEl.textContent = 'Keep studying and try again! 💪';
    }

    // Show result section
    const resultSection = document.getElementById('resultSection');
    resultSection.classList.add('show');

    // Smooth scroll to result
    setTimeout(() => {
        resultSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }, 100);
});