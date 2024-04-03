(function () {
    const Form = {
        agreeElement: null,
        processElement: null,
        fields: [
            {
                name: "name",
                id: "name",
                element: null,
                regex: /^[А-Я][а-я]+\s*$/,
                valid: false
            },
            {
                name: "lastName",
                id: "last-name",
                element: null,
                regex: /^[А-Я][а-я]+\s*$/,
                valid: false
            },
            {
                name: "email",
                id: "email",
                element: null,
                regex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                valid: false
            }
        ],
        init() {
            const that = this;
            this.fields.forEach(item => {
                item.element = document.getElementById(item.id);
                item.element.onchange = function () {
                    that.validateField.call(that, item, this);
                }
            });

            this.agreeElement = document.getElementById('agree');
            this.processElement = document.getElementById('process');
            this.agreeElement.onchange = function () {
                that.validateForm();
            }
            this.processElement.onclick = function () {
                that.processForm();
            }
        },
        validateField(field, element) {
            if (!element.value || !element.value.match(field.regex)) {
                element.parentNode.style.borderColor = 'red';
                field.valid = false;
            } else {
                element.parentNode.removeAttribute('style');
                field.valid = true;
            }
            this.validateForm();
        },
        validateForm() {
            const validForm = this.fields.every(item => item.valid);
            const isValid = this.agreeElement.checked && validForm;

            if (isValid) {
                this.processElement.removeAttribute('disabled');
            } else {
                this.processElement.setAttribute('disabled', 'disabled');
            }

            return isValid;
        },
        processForm () {
            if (this.validateForm()) {
                /*let paramString = '';*/
                this.fields.forEach(item => {
                    sessionStorage.setItem(item.name, item.element.value);
                    /*paramString += (!paramString ? '?' : '&') + item.name + '=' + item.element.value;*/
                });
                /*location.href = 'choice.html' + paramString;*/
                location.href = 'choice.html';
            }
        }
    };

    Form.init();
})();