import './index.css';

import { initialCards} from './components/card.js';
import { openPopup } from './components/modal.js';
import { enableValidationAllForms } from './components/validate.js';
import {validationSettings, initialUser} from './components/utils.js';
import { getUser, getCards, config } from './components/api.js';


const popupAddCard = document.querySelector('#addCard');
const popupEditProfile = document.querySelector('#editProfile');
const popupEditAvatar = document.querySelector('#editAvatar');

const formAddCard = popupAddCard.querySelector('#formAddCard');
const formEditProfile = popupEditProfile.querySelector('#formEditPofile');
const formEditAvatar = popupEditAvatar.querySelector('#formEditAvatar');

const buttonAddCard = document.querySelector('.profile-section__add');
const buttonEditProfile = document.querySelector('.profile-section__edit');
const buttonEditAvatar = document.querySelector('.profile-section__edit-avatar');


const primaryUser = getUser({config: config, isMe: true});
const primaryCards = getCards();



initialUser(primaryUser);
initialCards(primaryCards);


buttonAddCard.addEventListener('click', () => {
    openPopup({popup: popupAddCard, formElement: formAddCard, options: {needReset: true, validationSettings: validationSettings}});
});
buttonEditProfile.addEventListener('click', () => {
    openPopup({popup: popupEditProfile, formElement: formEditProfile, options: {validationSettings: validationSettings}});
});
buttonEditAvatar.addEventListener('click', () => {
    openPopup({popup: popupEditAvatar, formElement: formEditAvatar, options: {needReset: true, validationSettings: validationSettings}});

});


enableValidationAllForms(validationSettings);



