import {UrlManager} from "../utils/url-manager.js";
import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {Auth} from "../services/auth";

export class Answers {
    quiz = null;
    currentIndex = 1;
    routeParams = null;
    userInfo = null;

    constructor() {
        this.routeParams = UrlManager.getQueryParams();
        this.init();
    }

    async init() {
        if (this.routeParams.id) {
            this.userInfo = Auth.getUserInfo();
            if (this.userInfo) {
                try {
                    const result = await CustomHttp.request(config.host + '/tests/' + this.routeParams.id + '/result/details?userId=' + this.userInfo.userId);

                    if (result) {
                        if (result.error) {
                            throw new Error(result.error);
                        }

                        document.getElementById('to-result').href = '#/result?id=' + this.routeParams.id;
                        this.quiz = result.test;
                        this.showQuestions();
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        }
    }

    showQuestions() {
        document.getElementById('username').innerText = this.userInfo.fullName + ', '
            + this.userInfo.email;

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
    }

    showAnswers(question, answerOption) {
        question.answers.forEach(answer => {
            const correct = answer.correct;

            const answerBlock = document.createElement('div');
            answerBlock.className = 'answer';

            if (correct) {
                answerBlock.className += ' right';
            } else if (typeof correct !== "undefined") {
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