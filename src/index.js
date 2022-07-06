import './index.css';


import { 
    openPopup, 
    addEventSubmitForForm, 
    addEventForClosePopup,
    fillInitialValuesFields,
    closePopup,
} from './components/modal.js';
import { 
    enableValidationAllForms,
    checkValidityOfFields,
    toggleButtonSubmitState,
 } from './components/validate.js';
import {
    validationSettings, 
    initialUser, 
    userObject, 
    cardItemsList
} from './components/utils.js';
import { 
    getUser, 
    getCards, 
    config, 
    updateProfileInformation, 
    addCardOnServer, 
    deleteCardFromServer,
    updateAvatar, 
} from './components/api.js';
import { 
    getCardObject, 
    insertCardInsideList 
} from './components/card.js';


const popupAddCard = document.querySelector('#addCard');
const popupEditProfile = document.querySelector('#editProfile');
const popupEditAvatar = document.querySelector('#editAvatar');

const formAddCard = popupAddCard.querySelector('#formAddCard');
const formEditProfile = popupEditProfile.querySelector('#formEditPofile');
const formEditAvatar = popupEditAvatar.querySelector('#formEditAvatar');

const buttonSubmitFormAddCard = formAddCard.querySelector('.form__save');
const buttonSubmitFormEditProfile = formEditProfile.querySelector('.form__save');
const buttonSubmitFormEditAvatar = formEditAvatar.querySelector('.form__save');

const buttonAddCard = document.querySelector('.profile-section__add');
const buttonEditProfile = document.querySelector('.profile-section__edit');
const buttonEditAvatar = document.querySelector('.profile-section__edit-avatar');

const inputSourceImg = formAddCard.elements.description;
const inputNameCard = formAddCard.elements.name;

const profileAvatar = document.querySelector('.profile-section__avatar');

let firstClickAddCard = true;
let firstClickEditProfile = true;
let firstClickEditAvatar = true;

const primaryUser = getUser({config: config, isMe: true});

function confirmDeleteCallback(evt) {
    evt.preventDefault();
    deleteCardFromServer({
        idObj: this.cardObject.cardId, 
        cardElement: this.cardElement,
        handlerObject: this,
        buttonSubmit: this.buttonSubmit,
    });
}

function handleProfileEditFormSubmit(evt) {
    evt.preventDefault();
    const btnPrimaryValue = this.buttonSubmit.textContent;
    this.buttonSubmit.textContent = 'Сохранение...';
    setTimeout(() => {   // DOM не успевает перерисоваться              
        updateProfileInformation({
            information: {
                name: this.formElement.elements.name.value,
                description: this.formElement.elements.description.value,
            }
        })
        .then(res => {
            console.log(res);
            closePopup({popup: this.popup, handleEvent: handleProfileEditFormSubmit});
        })
        .catch(error => {
            console.log(error);
        })
        .finally(() => {
            this.buttonSubmit.textContent = btnPrimaryValue;
        })
    }, 1);
}

function handleEditAvatarFormSubmit(evt) {
    evt.preventDefault();
    const inputLinkToAvatar = this.popup.querySelector('.form__input-text');

    const btnPrimaryValue = this.buttonSubmit.textContent;
    this.buttonSubmit.textContent = 'Сохранение...';

    setTimeout(() => {   // DOM не успевает перерисоваться  
        
        updateAvatar({link: inputLinkToAvatar.value})
        .then(userAvatar => {
            profileAvatar.src = userAvatar.avatar;
            closePopup({popup: this.popup, handleEvent: handleEditAvatarFormSubmit});
        })
        .catch(error => {
            console.log(error);
        })
        .finally(() => {
            this.buttonSubmit.textContent = btnPrimaryValue;
        })
        
    }, 1);
    
}

function addCardOnPage(evt) {
    evt.preventDefault();
    
    const btnPrimaryValue = this.buttonSubmit.textContent;
    this.buttonSubmit.textContent = 'Сохранение...';

    setTimeout(() => {
        
        addCardOnServer({information: {name: inputNameCard.value, link: inputSourceImg.value}})
        .then(card => {
            const cardObject = getCardObject(card, userObject['_id'], confirmDeleteCallback);
            insertCardInsideList(cardObject, cardItemsList);
            closePopup({popup: popupAddCard, handleEvent: addCardOnPage});
        })
        .catch(error => {
            console.log(error);
        })
        .finally(() => {
            this.buttonSubmit.textContent = btnPrimaryValue;
        })
    }, 1);
    
}



initialUser(primaryUser);
getCards({confirmDeleteCallback: confirmDeleteCallback});


buttonAddCard.addEventListener('click', () => {
    openPopup({popup: popupAddCard});
    formAddCard.reset();
    checkValidityOfFields(formAddCard, validationSettings);
    toggleButtonSubmitState(formAddCard, validationSettings);
    if(firstClickAddCard) {
        addEventForClosePopup({popup: popupAddCard});
        addEventSubmitForForm({
            popup: popupAddCard,
            formElement: formAddCard, 
            handlers: addCardOnPage, 
            buttonSubmit: buttonSubmitFormAddCard,
        });
        firstClickAddCard = false;
    }
});


buttonEditProfile.addEventListener('click', () => {
    openPopup({popup: popupEditProfile});
    fillInitialValuesFields(formEditProfile);
    checkValidityOfFields(formEditProfile, validationSettings);
    toggleButtonSubmitState(formEditProfile, validationSettings);
    if(firstClickEditProfile) {
        addEventForClosePopup({popup: popupEditProfile});
        addEventSubmitForForm({
            popup: popupEditProfile,
            formElement: formEditProfile, 
            handlers: handleProfileEditFormSubmit, 
            buttonSubmit: buttonSubmitFormEditProfile,
        })
        firstClickEditProfile = false;
    }
});

buttonEditAvatar.addEventListener('click', () => {
    openPopup({popup: popupEditAvatar});
    formEditAvatar.reset();
    checkValidityOfFields(formEditAvatar, validationSettings);
    toggleButtonSubmitState(formEditAvatar, validationSettings);
    if(firstClickEditAvatar) {
        addEventForClosePopup({popup: popupEditAvatar});
        addEventSubmitForForm({
            popup: popupEditAvatar,
            formElement: formEditAvatar, 
            handlers: handleEditAvatarFormSubmit, 
            buttonSubmit: buttonSubmitFormEditAvatar,
        })
        firstClickEditAvatar = false;
    }
});


enableValidationAllForms(validationSettings);



