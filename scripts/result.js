(function () {
    const Result = {
        init() {
            document.getElementById('result-score').innerText = sessionStorage.getItem('score') + '/' + sessionStorage.getItem('total');
        }
    }

    Result.init();
})();