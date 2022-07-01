import './index.css';

import initialCards from './components/cards.js';
import { addCardOnPage, getCardObject, insertCardInsideList } from './components/card.js';
import { handleEditAvatarFormSubmit,
         handleProfileEditFormSubmit,
         openPopup 
    } from './components/modal.js';
import { checkValidityOfFields, enableValidationAllForms, toggleButtonSubmitState } from './components/validate.js';
import {validationSettings, initialUser} from './components/utils.js';
import { getUser, config } from './components/api.js';


const popupAddCard = document.querySelector('#addCard');
const popupEditProfile = document.querySelector('#editProfile');
const popupEditAvatar = document.querySelector('#editAvatar');
const popupImage = document.querySelector('#openImage');

const formAddCard = popupAddCard.querySelector('#formAddCard');
const formEditProfile = popupEditProfile.querySelector('#formEditPofile');
const formEditAvatar = popupEditAvatar.querySelector('.form');

const buttonAddCard = document.querySelector('.profile-section__add');
const buttonEditProfile = document.querySelector('.profile-section__edit');
const buttonEditAvatar = document.querySelector('.profile-section__edit-avatar');

const profileName = document.querySelector('.profile-section__name');
const profileText = document.querySelector('.profile-section__text');

const primaryUser = getUser({config: config, isMe: true});



initialUser(primaryUser);

initialCards.forEach(function(item) {
    const cardObject = getCardObject(item, popupImage);
    insertCardInsideList(cardObject);
});




formAddCard.addEventListener('submit', evt => {
    addCardOnPage(evt, popupAddCard);
});
formEditProfile.addEventListener('submit', evt => {
    handleProfileEditFormSubmit(evt, popupEditProfile, profileName, profileText)
});
formEditAvatar.addEventListener('submit', evt => {
    handleEditAvatarFormSubmit(evt, popupEditAvatar)
});



buttonAddCard.addEventListener('click', () => {
    openPopup(addCard, formAddCard, {needReset: true});
    checkValidityOfFields(formAddCard, validationSettings);
    toggleButtonSubmitState(formAddCard, validationSettings);
});
buttonEditProfile.addEventListener('click', () => {
    openPopup(editProfile, formEditProfile, {fillInitialValuesFields: [profileName, profileText]});
    checkValidityOfFields(formEditProfile, validationSettings);
    toggleButtonSubmitState(formEditProfile, validationSettings);
});
buttonEditAvatar.addEventListener('click', () => {
    openPopup(editAvatar, formEditAvatar, {needReset: true});
    checkValidityOfFields(formEditAvatar, validationSettings);
    toggleButtonSubmitState(formEditAvatar, validationSettings);
});


enableValidationAllForms(validationSettings);



