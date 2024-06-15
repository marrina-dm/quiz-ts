import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {Auth} from "../services/auth";
import {UrlManager} from "../utils/url-manager";
import {QueryParamsType} from "../types/query-params.type";
import {UserInfoType} from "../types/user-info.type";
import {DefaultResponseType} from "../types/default-response.type";
import {PassTestResponseType} from "../types/pass-test-response.type";
import {TestResultType} from "../types/test-result.type";

export class Result {
    private routeParams: QueryParamsType;

    constructor() {
        this.routeParams = UrlManager.getQueryParams();
        this.init();
    }

    private async init(): Promise<void> {
        const userInfo: UserInfoType | null = Auth.getUserInfo();

        if (!userInfo) {
            location.href = '/#';
            return;
        }

        if (this.routeParams.id) {
            try {
                const result: DefaultResponseType | PassTestResponseType = await CustomHttp.request(config.host + '/tests/' + this.routeParams.id + '/result?userId=' + userInfo.userId);

                if (result) {
                    if ((result as DefaultResponseType).error !== undefined) {
                        throw new Error((result as DefaultResponseType).message);
                    }

                    const resultScoreElement: HTMLElement | null = document.getElementById('result-score');

                    if (resultScoreElement) {
                        resultScoreElement.innerText = (result as PassTestResponseType).score + '/' + (result as PassTestResponseType).total;
                    }

                    const answersLinkElement: HTMLLinkElement | null = document.getElementById('answers-link') as HTMLLinkElement;
                    if (answersLinkElement) {
                        answersLinkElement.href = '#/answers?id=' + this.routeParams.id;
                    }
                    return;
                }
            } catch (error) {
                console.log(error);
            }
        }

        location.href = '/#';
    }
}