import {openPopup, addEventSubmitForForm, addEventForClosePopup } from "./modal.js";


const userAvatar = document.querySelector('.profile-section__avatar');
const userName = document.querySelector('.profile-section__name');
const userAbout = document.querySelector('.profile-section__text');
const popupConfirmDelete = document.querySelector('#confirmDelete');
const buttonSubmitPopupConfirmDelete = popupConfirmDelete.querySelector('.form__save');



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

export function initialUser(data) {
    data
        .then(user => {
            if(user) {
                userAvatar.src = user.avatar;
                userName.textContent = user.name;
                userAbout.textContent = user.about;
                userObject.avatar = user.avatar;
                userObject.name = user.name;
                userObject.description = user.about;
                userObject['_id'] = user['_id'];
            }
        })
        .catch(error => {
            console.log(error);
        })
}

export function requestPromiseFromURL(settings={
    config: {
        baseUrl: null, 
        cohortId: null,
     }, 
     options: {}}, 
    target='') {
    if(settings.config.baseUrl && settings.config.cohortId && settings.options.headers.authorization) {
        return (
            fetch(`${settings.config.baseUrl}/${settings.config.cohortId}/${target}`, settings.options)
        );
    } else {
        console.log('Не хватает свойств, переданных функции.');
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



export function getDataOnRequestToServer(settings={configForRequest: {}, targetLink: ''}) {
    return (
        requestPromiseFromURL(settings.configForRequest, settings.targetLink)
        .then(checkPromiseResponse)
        .then(data => {
            return data;
        })
        .catch(error => {
            console.log(error);
            return false;
        })
    );  
}