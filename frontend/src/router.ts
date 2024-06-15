import {Form} from "./components/form";
import {Choice} from "./components/choice";
import {Test} from "./components/test";
import {Result} from "./components/result";
import {Answers} from "./components/answers";
import {Auth} from "./services/auth";
import {RouteType} from "./types/route.type";
import {UserInfoType} from "./types/user-info.type";
import {ActionPagesType} from "./types/action-pages.type";

export class Router {
    readonly contentElement: HTMLElement | null;
    readonly stylesElement: HTMLElement | null;
    readonly titleElement: HTMLElement | null;
    readonly profileElement: HTMLElement | null;
    readonly profileFullNameElement: HTMLElement | null;

    readonly routes: RouteType[];

    constructor() {
        this.contentElement = document.getElementById('content');
        this.stylesElement = document.getElementById('styles');
        this.titleElement = document.getElementById('page-title');
        this.profileElement = document.getElementById('profile');
        this.profileFullNameElement = document.getElementById('profile-full-name');

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
                route: '#/signup',
                title: 'Регистрация',
                template: 'templates/signup.html',
                styles: 'css/form.css',
                load: () => {
                    new Form(ActionPagesType.signup);
                }
            },
            {
                route: '#/login',
                title: 'Вход в систему',
                template: 'templates/login.html',
                styles: 'css/form.css',
                load: () => {
                    new Form(ActionPagesType.login);
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

    public async openRoute(): Promise<void> {
        const urlRoute: string = window.location.hash.split('?')[0];
        if (urlRoute === '#/logout') {
            const result: boolean = await Auth.logout();
            if (result) {
                window.location.href = '#/';
                return;
            }
        }

        const newRoute: RouteType | undefined = this.routes.find((item: RouteType) => item.route === urlRoute);

        if (!newRoute) {
            window.location.href = '#/';
            return;
        }

        if (!this.contentElement || !this.stylesElement || !this.titleElement || !this.profileElement || !this.profileFullNameElement) {
            if (urlRoute === '#/') {
                return;
            } else {
                window.location.href = '#/';
                return;
            }
        }

        this.contentElement.innerHTML = await fetch(newRoute.template).then(response => response.text());
        this.stylesElement.setAttribute('href', newRoute.styles);
        this.titleElement.innerText = newRoute.title;

        const userInfo: UserInfoType | null = Auth.getUserInfo();
        const accessToken: string | null = localStorage.getItem(Auth.accessTokenKey);

        if (userInfo && accessToken) {
            this.profileElement.style.display = 'flex';
            this.profileFullNameElement.innerText = userInfo.fullName;
        } else {
            this.profileElement.style.display = 'none';
        }

        newRoute.load();
    }
}