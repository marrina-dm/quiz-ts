import {Form} from "./components/form.js";
import {Choice} from "./components/choice.js";
import {Test} from "./components/test.js";
import {Result} from "./components/result.js";
import {Answers} from "./components/answers.js";

export class Router {
    constructor() {
        this.routes = [
            {
                route: '#/',
                title: 'Главная',
                template: 'templates/index.html',
                styles: 'css/index.css',
                load: () => {
                }
            },
            {
                route: '#/form',
                title: 'Регистрация',
                template: 'templates/form.html',
                styles: 'css/form.css',
                load: () => {
                    new Form();
                }
            },
            {
                route: '#/choice',
                title: 'Выбор теста',
                template: 'templates/choice.html',
                styles: 'css/choice.css',
                load: () => {
                    new Choice();
                }
            },
            {
                route: '#/test',
                title: 'Прохождение теста',
                template: 'templates/test.html',
                styles: 'css/test.css',
                load: () => {
                    new Test();
                }
            },
            {
                route: '#/result',
                title: 'Результаты',
                template: 'templates/result.html',
                styles: 'css/result.css',
                load: () => {
                    new Result();
                }
            },
            {
                route: '#/answers',
                title: 'Ответы',
                template: 'templates/answers.html',
                styles: 'css/answers.css',
                load: () => {
                    new Answers();
                }
            }
        ]
    }

    async openRoute() {
        const newRoute = this.routes.find(item => item.route === window.location.hash);

        if (!newRoute) {
            window.location.href = '#/';
            return;
        }

        document.getElementById('content').innerHTML = await fetch(newRoute.template).then(response => response.text());
        document.getElementById('styles').setAttribute('href', newRoute.styles);
        document.getElementById('page-title').innerText = newRoute.title;
        newRoute.load();
    }
}