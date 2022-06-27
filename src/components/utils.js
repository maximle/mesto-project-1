export const cardItemsList = document.querySelector('.photo-grid__items');
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

export function getCloneNode(template, desiredNode) {
    const photoGridItemTemplate = document.querySelector(template).content;
    return photoGridItemTemplate.querySelector(desiredNode).cloneNode(true);
}



export function getArrayInputsOfForm(formElement, validationSettings) {
    return Array.from(formElement.querySelectorAll(validationSettings.inputSelector));
}

