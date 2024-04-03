(function () {
    const Answers = {
        quiz: null,
        rights: null,
        currentIndex: 1,
        resultsArray: null,
        init() {
            checkUserData();
            const testId = sessionStorage.getItem('id');

            if (testId) {
                const xhrQuiz = new XMLHttpRequest();
                const xhrRight = new XMLHttpRequest();
                xhrQuiz.open('GET', 'https://testologia.ru/get-quiz?id=' + testId, false);
                xhrRight.open('GET', 'https://testologia.ru/get-quiz-right?id=' + testId, false);

                xhrQuiz.send();
                xhrRight.send();

                if (xhrQuiz.status === 200 && xhrQuiz.responseText && xhrRight.status === 200 && xhrRight.responseText) {
                    try {
                        this.quiz = JSON.parse(xhrQuiz.responseText);
                        this.rights = JSON.parse(xhrRight.responseText);
                    } catch (e) {
                        sessionStorage.clear();
                        location.href = 'index.html';
                    }

                    this.showQuestions();
                } else {
                    sessionStorage.clear();
                    location.href = 'index.html';
                }
            } else {
                sessionStorage.clear();
                location.href = 'index.html';
            }
        },
        showQuestions() {
            let results = sessionStorage.getItem('results');
            this.resultsArray = (sessionStorage.getItem('results')) ? JSON.parse(results) : [];

            document.getElementById('username').innerText = sessionStorage.getItem('name') + ' '
                + sessionStorage.getItem('lastName') + ', '
                + sessionStorage.getItem('email');

            document.getElementById('pre-title').innerText = this.quiz.name;

            this.quiz.questions.forEach(question => {
                const answerOption = document.createElement('div');
                answerOption.className = 'answers-option';

                const answerTitle = document.createElement('h2');
                answerTitle.className = 'answer-title';
                answerTitle.innerHTML = '<span>Вопрос ' + this.currentIndex + ':</span> ' + question.question;

                answerOption.appendChild(answerTitle);

                this.showAnswers(question, answerOption);

                document.getElementById('answers-options').appendChild(answerOption);
                this.currentIndex++;
            });
        },
        showAnswers(question, answerOption) {
            const chosen = this.resultsArray.find(item => question.id === item.questionId).chosenAnswerId;
            const right = this.rights[this.currentIndex - 1];
            question.answers.forEach(answer => {
                const id = answer.id;
                const answerBlock = document.createElement('div');
                answerBlock.className = 'answer';

                if (id === right && id === chosen) {
                    answerBlock.className += ' right';
                } else if (id === chosen && chosen !== right) {
                    answerBlock.className += ' wrong';
                }

                const radio = document.createElement('div');
                radio.className = 'radio';

                const answerText = document.createElement('p');
                answerText.className = 'answer-text';
                answerText.innerText = answer.answer;

                answerBlock.appendChild(radio);
                answerBlock.appendChild(answerText);

                answerOption.appendChild(answerBlock);
            });
        }
    }

    Answers.init();
})();