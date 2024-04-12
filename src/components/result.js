export class Result {
    constructor() {
        document.getElementById('result-score').innerText = sessionStorage.getItem('score') + '/' + sessionStorage.getItem('total');
    }
}