import {StorageManager} from "../utils/storage-manager.js";

export class Choice {

    constructor() {
        this.quizzes = [];
        StorageManager.checkUserData();

        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://testologia.ru/get-quizzes', false);
        xhr.send();

        if (xhr.status === 200 && xhr.responseText) {
            try {
                this.quizzes = JSON.parse(xhr.responseText);
            } catch (e) {
                sessionStorage.clear();
                location.href = '#/';
            }

            this.processQuizzes();
        } else {
            sessionStorage.clear();
            location.href = '#/';
        }
    }

    processQuizzes() {
        const choiceOptionsElement = document.getElementById('choice-options');
        if (this.quizzes && this.quizzes.length > 0) {
            this.quizzes.forEach(quiz => {
                const that = this;
                const choiceOptionElement = document.createElement('div');
                choiceOptionElement.className = 'choice-option';
                choiceOptionElement.setAttribute('data-id', quiz.id);
                choiceOptionElement.onclick = function () {
                    that.chooseQuiz(this);
                }

                const choiceOptionTextElement = document.createElement('p');
                choiceOptionTextElement.className = 'choice-option-text';
                choiceOptionTextElement.innerText = quiz.name;

                const choiceOptionArrowElement = document.createElement('div');
                choiceOptionArrowElement.className = 'choice-option-arrow';

                const choiceOptionImageElement = document.createElement('img');
                choiceOptionImageElement.setAttribute('src', 'img/arrow.png');
                choiceOptionImageElement.setAttribute('alt', 'Стрелка');

                choiceOptionArrowElement.appendChild(choiceOptionImageElement);
                choiceOptionElement.appendChild(choiceOptionTextElement);
                choiceOptionElement.appendChild(choiceOptionArrowElement);

                choiceOptionsElement.appendChild(choiceOptionElement);
            });
        }
    }

    chooseQuiz(element) {
        const dataId = element.getAttribute('data-id');
        if (dataId) {
            sessionStorage.setItem('id', dataId);
            location.href = '#/test';
        }
    }
}