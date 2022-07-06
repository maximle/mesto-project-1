import {openPopup, addEventSubmitForForm, addEventForClosePopup } from "./modal.js";



const popupConfirmDelete = document.querySelector('#confirmDelete');
const buttonSubmitPopupConfirmDelete = popupConfirmDelete.querySelector('.form__save');
let primaryTextButton = '';



export const userObject = {
    name: '',
    description: '',
    avatar: '',
    '_id': ''
};
export const cardItemsList = document.querySelector('.photo-grid__items');
export const popupImage = document.querySelector('#openImage');



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
    if(formElement.querySelector(validationSettings.inputSelector)) {
        return Array.from(formElement.querySelectorAll(validationSettings.inputSelector));
    } else {
        return false;
    }
}

export function checkPromiseResponse(response) {
    if(response.ok) {
        return response.json();
    } else {
        return Promise.reject(`Ошибка: ${response.status} - ${response.statusText}`)
    }
}



export function checkLoadImageFromServer(cardObject) {
    return new Promise(function(resolve, reject) {
        const image = document.createElement('img');
        image.src = cardObject.cardImg.src;
        image.onerror = function() {
            reject(cardObject);
        };
        image.onload = function() {
            resolve(cardObject);
        };
    });
  }

export function addEventForConfirmDelete(cardElement, cardObject) {
    addEventSubmitForForm({
        popup: popupConfirmDelete,
        buttonSubmit: buttonSubmitPopupConfirmDelete,
        handlers: cardObject.confirmDeleteCallback, 
        cardElement: cardElement, 
        cardObject: cardObject,
    });
    addEventForClosePopup({popup: popupConfirmDelete});
    openPopup({popup: popupConfirmDelete});
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