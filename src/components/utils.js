
let primaryTextButton = '';



export const userObject = {
    name: '',
    description: '',
    avatar: '',
    '_id': ''
};




export const validationSettings = {
    formSelector: '.form',
    inputSelector: '.form__input-text',
    submitButtonSelector: '.form__save',
    inputErrorClass: 'form__input-text_invalid',
    errorId: null,
    errorClassActive: 'form__title-error_active',

    set setErrorId(inputId) {
        this.errorId = `#${inputId}-error`;
    }
}

export function getArrayInputsOfForm(formElement, validationSettings) {
    if(formElement.querySelector(validationSettings.inputSelector)) {
        return Array.from(formElement.querySelectorAll(validationSettings.inputSelector));
    } else {
        return false;
    }
}



export function changeButtonTextDuringLoading(settings={
    button: null,
    loadingText: null,
    primaryText: null,
}) {
    if(settings.loadingText) {
        primaryTextButton = settings.primaryText;
        settings.button.textContent = settings.loadingText;
    } else {
        settings.button.textContent = primaryTextButton;
    }
}