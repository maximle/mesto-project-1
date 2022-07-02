const userAvatar = document.querySelector('.profile-section__avatar');
const userName = document.querySelector('.profile-section__name');
const userAbout = document.querySelector('.profile-section__text');
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
    return Array.from(formElement.querySelectorAll(validationSettings.inputSelector));
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
            }
        })
}

export function requestPromiseFromURL(settings={baseUrl: null, cohortId: null, headers: {authorization: null}}, target='') {
    if(settings.baseUrl && settings.cohortId && settings.headers.authorization) {
        return (
            fetch(`${settings.baseUrl}/${settings.cohortId}/${target}`, {
                headers: settings.headers,
            })
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

