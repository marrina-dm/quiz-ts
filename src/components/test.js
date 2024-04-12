import {StorageManager} from "../utils/storage-manager.js";

export class Test {
    constructor() {
        this.quiz = null;
        this.currentQuestionIndex = 1;
        this.questionTitleElement = null;
        this.optionsElement = null;
        this.nextButtonElement = null;
        this.prevButtonElement = null;
        this.passButtonElement = null;
        this.userResult = [];
        this.progressBarElement = null;

        StorageManager.checkUserData();
        const testId = sessionStorage.getItem('id');

        if (testId) {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', 'https://testologia.ru/get-quiz?id=' + testId, false);

            xhr.send();

            if (xhr.status === 200 && xhr.responseText) {
                try {
                    this.quiz = JSON.parse(xhr.responseText);
                } catch (e) {
                    sessionStorage.clear();
                    location.href = '#/';
                }

                this.startQuiz();
            } else {
                sessionStorage.clear();
                location.href = '#/';
            }
        } else {
            sessionStorage.clear();
            location.href = '#/';
        }
    }

    startQuiz() {
        this.questionTitleElement = document.getElementById('title');
        this.optionsElement = document.getElementById('options');

        this.nextButtonElement = document.getElementById('next');
        this.nextButtonElement.onclick = this.move.bind(this, 'next');

        this.passButtonElement = document.getElementById('pass');
        this.passButtonElement.onclick = this.move.bind(this, 'pass');

        this.prevButtonElement = document.getElementById('prev');
        this.prevButtonElement.onclick = this.move.bind(this, 'prev');

        this.progressBarElement = document.getElementById('progressBar');

        document.getElementById('preTitle').innerText = this.quiz.name;

        this.prepareProgressBar();
        this.showQuestion();

        const timerElement = document.getElementById('timer');
        let seconds = 59;
        timerElement.innerText = seconds;
        const interval = setInterval(function () {
            seconds--;
            timerElement.innerText = seconds;
            if (seconds === 0) {
                clearInterval(interval);
                this.complete();
            }
        }.bind(this), 1000);
    }

    prepareProgressBar() {
        for (let i = 0; i < this.quiz.questions.length; i++) {
            const itemElement = document.createElement('div');
            itemElement.className = 'test-progress-bar-item ' + (i === 0 ? 'active' : '');

            const itemCircleElement = document.createElement('div');
            itemCircleElement.className = 'test-progress-bar-item-circle';

            const itemTextElement = document.createElement('div');
            itemTextElement.className = 'test-progress-bar-item-text';
            itemTextElement.innerText = 'Вопрос ' + (i + 1);

            itemElement.appendChild(itemCircleElement);
            itemElement.appendChild(itemTextElement);
            this.progressBarElement.appendChild(itemElement);
        }
    }

    showQuestion() {
        const activeQuestion = this.quiz.questions[this.currentQuestionIndex - 1];
        this.questionTitleElement.innerHTML = '<span>Вопрос ' + this.currentQuestionIndex + ':</span> ' + activeQuestion.question;

        this.optionsElement.innerHTML = '';
        const that = this;
        const chosenOption = this.userResult.find(item => item.questionId === activeQuestion.id);

        activeQuestion.answers.forEach(answer => {
            const optionElement = document.createElement('div');
            optionElement.className = 'test-question-option';

            const inputId = 'answer-' + answer.id;
            const inputElement = document.createElement('input');
            inputElement.className = 'option-answer';
            inputElement.setAttribute('id', inputId);
            inputElement.setAttribute('type', 'radio');
            inputElement.setAttribute('name', 'answer');
            inputElement.setAttribute('value', answer.id);
            if (chosenOption && chosenOption.chosenAnswerId === answer.id) {
                inputElement.setAttribute('checked', 'checked');
            }

            inputElement.onchange = function () {
                that.chooseAnswer();
            }
            const labelElement = document.createElement('label');
            labelElement.setAttribute('for', inputId);
            labelElement.innerText = answer.answer;

            optionElement.appendChild(inputElement);
            optionElement.appendChild(labelElement);
            this.optionsElement.appendChild(optionElement);
        });

        if (chosenOption && chosenOption.chosenAnswerId) {
            this.nextButtonElement.removeAttribute('disabled');
            this.passButtonElement.setAttribute('disabled', 'disabled');
        } else {
            this.nextButtonElement.setAttribute('disabled', 'disabled');
            this.passButtonElement.removeAttribute('disabled');
        }

        if (this.currentQuestionIndex === this.quiz.questions.length) {
            this.nextButtonElement.innerText = 'Завершить';
        } else {
            this.nextButtonElement.innerText = 'Далее';
        }

        if (this.currentQuestionIndex > 1) {
            this.prevButtonElement.removeAttribute('disabled');
        } else {
            this.prevButtonElement.setAttribute('disabled', 'disabled');
        }
    }

    chooseAnswer() {
        this.nextButtonElement.removeAttribute('disabled');
        this.passButtonElement.setAttribute('disabled', 'disabled');
    }

    move(action) {
        const choosingAnswer = Array.from(document.getElementsByClassName('option-answer')).find(element => element.checked);
        const activeQuestion = this.quiz.questions[this.currentQuestionIndex - 1];

        let chosenAnswerId = null;
        if (choosingAnswer && choosingAnswer.value) {
            chosenAnswerId = Number(choosingAnswer.value);
        }

        const existingResult = this.userResult.find(item => item.questionId === activeQuestion.id);
        if (existingResult) {
            existingResult.chosenAnswerId = chosenAnswerId;
        } else {
            this.userResult.push({
                questionId: activeQuestion.id,
                chosenAnswerId: chosenAnswerId
            });
        }

        if (action === 'next' || action === 'pass') {
            this.currentQuestionIndex++;
        } else {
            this.currentQuestionIndex--;
        }

        if (this.currentQuestionIndex > this.quiz.questions.length) {
            this.complete();
            return;
        }

        Array.from(this.progressBarElement.children).forEach((item, index) => {
            const currentItemIndex = index + 1;

            item.classList.remove('active');
            item.classList.remove('complete');

            if (currentItemIndex === this.currentQuestionIndex) {
                item.classList.add('active');
            } else if (currentItemIndex < this.currentQuestionIndex) {
                item.classList.add('complete');
            }
        })

        this.showQuestion();
    }

    complete() {
        const id = sessionStorage.getItem('id');
        const name = sessionStorage.getItem('name');
        const lastName = sessionStorage.getItem('lastName');
        const email = sessionStorage.getItem('email');
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://testologia.ru/pass-quiz?id=' + id, false);
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        xhr.send(JSON.stringify({
            name: name,
            lastName: lastName,
            email: email,
            results: this.userResult
        }));

        if (xhr.status === 200 && xhr.responseText) {
            let result = null;
            try {
                result = JSON.parse(xhr.responseText);
            } catch (e) {
                sessionStorage.clear();
                location.href = '#/';
            }

            if (result) {
                sessionStorage.setItem('results', JSON.stringify(this.userResult));
                sessionStorage.setItem('score', result.score);
                sessionStorage.setItem('total', result.total);
                location.href = '#/result';
            }
        } else {
            sessionStorage.clear();
            location.href = '#/';
        }
    }
}