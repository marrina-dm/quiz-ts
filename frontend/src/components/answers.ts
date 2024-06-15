import {UrlManager} from "../utils/url-manager";
import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {Auth} from "../services/auth";
import {QuizAnswerType, QuizQuestionType, QuizTestType, QuizType} from "../types/quiz.type";
import {QueryParamsType} from "../types/query-params.type";
import {UserInfoType} from "../types/user-info.type";
import {DefaultResponseType} from "../types/default-response.type";
import {TestResultType} from "../types/test-result.type";

export class Answers {
    private quiz: QuizType | null = null;
    private currentIndex: number = 1;
    readonly routeParams: QueryParamsType;
    private userInfo: UserInfoType | null = null;

    constructor() {
        this.routeParams = UrlManager.getQueryParams();
        this.init();
    }

    private async init(): Promise<void> {
        if (this.routeParams.id) {
            this.userInfo = Auth.getUserInfo();
            if (this.userInfo) {
                try {
                    const result: DefaultResponseType | QuizTestType = await CustomHttp.request(config.host + '/tests/' + this.routeParams.id + '/result/details?userId=' + this.userInfo.userId);

                    if (result) {
                        if ((result as DefaultResponseType).error !== undefined) {
                            throw new Error((result as DefaultResponseType).message);
                        }

                        const toResultElement: HTMLLinkElement | null = document.getElementById('to-result') as HTMLLinkElement;
                        if (toResultElement) {
                            toResultElement.href = '#/result?id=' + this.routeParams.id;
                        }

                        this.quiz = (result as QuizTestType).test;
                        this.showQuestions();
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        }
    }

    private showQuestions(): void {
        if (!this.userInfo) {
            location.href = '#/login';
            return;
        }

        if (!this.quiz) {
            return;
        }

        const usernameElement: HTMLElement | null = document.getElementById('username');

        if (usernameElement) {
            usernameElement.innerText = this.userInfo.fullName + ', ' + this.userInfo.email;
        }

        const preTitleElement: HTMLElement | null = document.getElementById('pre-title');
        if(preTitleElement) {
            preTitleElement.innerText = this.quiz.name;
        }

        this.quiz.questions.forEach((question: QuizQuestionType) => {
            const answerOption: HTMLElement | null = document.createElement('div');
            answerOption.className = 'answers-option';

            const answerTitle: HTMLElement | null = document.createElement('h2');
            answerTitle.className = 'answer-title';
            answerTitle.innerHTML = '<span>Вопрос ' + this.currentIndex + ':</span> ' + question.question;

            answerOption.appendChild(answerTitle);

            this.showAnswers(question, answerOption);

            const answersOptionsElement: HTMLElement | null = document.getElementById('answers-options');
            if (answersOptionsElement) {
                answersOptionsElement.appendChild(answerOption);
            }

            this.currentIndex++;
        });
    }

    private showAnswers(question: QuizQuestionType, answerOption: HTMLElement): void {
        question.answers.forEach((answer: QuizAnswerType) => {
            const correct: boolean | undefined = answer.correct;

            const answerBlock: HTMLElement | null = document.createElement('div');
            answerBlock.className = 'answer';

            if (correct) {
                answerBlock.className += ' right';
            } else if (typeof correct !== "undefined") {
                answerBlock.className += ' wrong';
            }

            const radio: HTMLElement | null = document.createElement('div');
            radio.className = 'radio';

            const answerText: HTMLElement | null = document.createElement('p');
            answerText.className = 'answer-text';
            answerText.innerText = answer.answer;

            answerBlock.appendChild(radio);
            answerBlock.appendChild(answerText);

            answerOption.appendChild(answerBlock);
        });
    }
}