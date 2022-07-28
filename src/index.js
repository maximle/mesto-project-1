import './index.css';
import FormValidator from './components/FormValidator.js';
import Api from './components/Api.js';
import Card from './components/Card.js';
import { UserInfo } from './components/UserInfo.js';
import { Section } from './components/Section.js';
import { insertCardOnPage, userName, userAbout } from './components/Popup.js';
import { PopupWithImage } from './components/PopupWithImage.js';
import { PopupWithForm } from './components/PopupWithForm.js';
<<<<<<< HEAD

const loadingText = 'Сохранение...';

const validationSettings = {
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


const params = {
    template: '#photo-grid__item', 
    node:'.photo-grid__element-container', 
    classOfImage:'.photo-grid__image', 
    classOfName:'.photo-grid__name', 
    classOfLike:'.photo-grid__like-icon', 
    classOfDelete:'.photo-grid__delete',
    classOfLikes: '.photo-grid__likes', 
    }

const config = {
    baseUrl: 'https://mesto.nomoreparties.co/v1',
    cohortId: 'plus-cohort-13',
    headers: {
        authorization: 'e4d16501-e8d2-438e-96b5-6b9c94c85c98',
        'Content-Type': 'application/json'
    },
    method: 'GET',
    body: null
}

const popupAddCard = document.querySelector('#addCard');
const popupEditProfile = document.querySelector('#editProfile');
const popupEditAvatar = document.querySelector('#editAvatar');
const popupImage = document.querySelector('#openImage');
const popupConfirmDelete = document.querySelector('#confirmDelete');

const formAddCard = popupAddCard.querySelector('#formAddCard');
const formEditProfile = popupEditProfile.querySelector('#formEditPofile');
const formEditAvatar = popupEditAvatar.querySelector('#formEditAvatar');
const cardPopupFromValidator = new FormValidator(formAddCard, validationSettings);
const userPopupFromValidator = new FormValidator(formEditProfile, validationSettings);
const avatarPopupFromValidator = new FormValidator(formEditAvatar, validationSettings);

const buttonAddCard = document.querySelector('.profile-section__add');
const buttonEditProfile = document.querySelector('.profile-section__edit');
const buttonEditAvatar = document.querySelector('.profile-section__edit-avatar');

const inputLinkToAvatar = formEditAvatar.querySelector('.form__input-text');

const inputSourceImg = formAddCard.elements.description;
const inputNameCard = formAddCard.elements.name;

const profileAvatar = document.querySelector('.profile-section__avatar');
const cardItemsList = document.querySelector('.photo-grid__items');

const cards = [];



const api = new Api({config});
const user = new UserInfo({nameSelector: userName, aboutSelector: userAbout, avatarSelector: profileAvatar}, api);
const popupWithImageObject = new PopupWithImage({selectorPopup: popupImage});
const popupConfirmDeleteObject = new PopupWithForm({selectorPopup: popupConfirmDelete, callbackSubmitForm: deleteCardFromServer});
const popupWithFormAddCard = new PopupWithForm({selectorPopup: popupAddCard, callbackSubmitForm: addCardOnPage});
const popupWithFormEditProfile = new PopupWithForm({selectorPopup: popupEditProfile, callbackSubmitForm: handleProfileEditFormSubmit});
const popupWithFormEditAvatar = new PopupWithForm({selectorPopup: popupEditAvatar, callbackSubmitForm: handleEditAvatarFormSubmit});



user.getUserInfo()
    .then(res => {
        api.getDataOnRequestToServer({target: 'cards', config1: {
            method: 'GET'
        }})
            .then(res => {
                res.forEach(card => {
                    const cardObject = new Card({
                        userId: user.user['_id'], 
                        params: params, 
                        api: api, 
                        popupOpenImage: popupWithImageObject, 
                        popupWithForm: popupConfirmDeleteObject
                    });
                    cards.push(cardObject.getCard({initialData: card}));
                    console.log(cards);
                    })
                const section = new Section({items: cards, renderer: insertCardOnPage}, cardItemsList);
                section.appendCardOnPage();
                return true;
            })
            .catch(err => {
                console.log(`Ошибка отрисовки всех карточек: ${err}`);
                return false;
            })
    })
    .then(res => {
        buttonAddCard.addEventListener('click', () => {
            popupWithFormAddCard.openPopup({reset: true});
            cardPopupFromValidator.enableValidation();
        });
        
        
        buttonEditProfile.addEventListener('click', () => {
            popupWithFormEditProfile.openPopup({withInitialValuesFields: true});
            userPopupFromValidator.enableValidation();
        });
        
        buttonEditAvatar.addEventListener('click', () => {
            popupWithFormEditAvatar.openPopup({reset: true});
            avatarPopupFromValidator.enableValidation();
        });
        
        console.log('Все нормально загрузилось');
    })
    .catch(errorArray => {
        console.log('Ошибка загрузки', errorArray);
    })


    function handleProfileEditFormSubmit(evt) {
        evt.preventDefault();
        popupWithFormEditProfile.changeButtonTextDuringLoading({loadingText: loadingText, primaryText: this.buttonSubmit.textContent});
        user.setUserInfo({
                name: this.formElement.elements.name.value,
                about: this.formElement.elements.description.value,})
            .then(res => {
                popupWithFormEditProfile.closePopup(evt);
            })
            .catch(error => {
                console.log(error);
            })
            .finally(() => {
                popupWithFormEditProfile.changeButtonTextDuringLoading({});
            })
        
    }
    
    function handleEditAvatarFormSubmit(evt) {
        evt.preventDefault();
        popupWithFormEditAvatar.changeButtonTextDuringLoading({loadingText: loadingText, primaryText: this.buttonSubmit.textContent});
        user.updateAvatar({link: inputLinkToAvatar.value})
            .then(userAvatar => {
                profileAvatar.src = userAvatar.avatar;
                popupWithFormEditAvatar.closePopup(evt, {objectHandler: this});
            })
            .catch(error => {
                console.log(error);
            })
            .finally(() => {
                popupWithFormEditAvatar.changeButtonTextDuringLoading({});
            }) 
    }

=======
import { popupAddCard, popupEditProfile, popupEditAvatar, popupImage, popupConfirmDelete, formAddCard, formEditProfile, formEditAvatar, buttonAddCard, buttonEditProfile, buttonEditAvatar, inputLinkToAvatar, inputSourceImg, inputNameCard, profileAvatar, cardItemsList, cards, loadingText, validationSettings, params, config } from './utils/constants.js'

const cardPopupFromValidator = new FormValidator(formAddCard, validationSettings);
const userPopupFromValidator = new FormValidator(formEditProfile, validationSettings);
const avatarPopupFromValidator = new FormValidator(formEditAvatar, validationSettings);
cardPopupFromValidator.enableValidation();
userPopupFromValidator.enableValidation();
avatarPopupFromValidator.enableValidation();

const api = new Api({config});
const user = new UserInfo({nameSelector: userName, aboutSelector: userAbout, avatarSelector: profileAvatar}, api);
const popupWithImageObject = new PopupWithImage({selectorPopup: popupImage});
const popupConfirmDeleteObject = new PopupWithForm({selectorPopup: popupConfirmDelete, callbackSubmitForm: deleteCardFromServer});
const popupWithFormAddCard = new PopupWithForm({selectorPopup: popupAddCard, callbackSubmitForm: addCardOnPage});
const popupWithFormEditProfile = new PopupWithForm({selectorPopup: popupEditProfile, callbackSubmitForm: handleProfileEditFormSubmit});
const popupWithFormEditAvatar = new PopupWithForm({selectorPopup: popupEditAvatar, callbackSubmitForm: handleEditAvatarFormSubmit});


const section = new Section({items: cards, renderer: insertCardOnPage}, cardItemsList);

Promise.all([
    api.getDataOnRequestToServer({target: 'users/me', config1: {
      method: 'GET'
    }}),
    api.getDataOnRequestToServer({target: 'cards', config1: {
      method: 'GET'
    }})
  ])
    .then (([profileInfo, cardsArr]) => {
      console.log(profileInfo, cardsArr)

      user.setUserInfo({userInfo: profileInfo});
      cardsArr.forEach(card => {
        const cardObject = new Card({
          userId: user.user['_id'],
          params: params,
          api: api,
          popupOpenImage: popupWithImageObject,
          popupWithForm: popupConfirmDeleteObject
        });
        cards.push(cardObject.getCard({initialData: card}));
      })
      section.appendCardOnPage();
      buttonAddCard.addEventListener('click', () => {
          popupWithFormAddCard.openPopup({reset: true});
      })
      buttonEditProfile.addEventListener('click', () => {
          popupWithFormEditProfile.openPopup({withInitialValuesFields: true});
      })
      buttonEditAvatar.addEventListener('click', () => {
          popupWithFormEditAvatar.openPopup({reset: true});
      })
        console.log('Все нормально загрузилось');
      })
      .catch(errorArray => {
        console.log('Ошибка загрузки', errorArray);
    })

function handleProfileEditFormSubmit(evt) {
  evt.preventDefault();
  const inputValues = popupWithFormEditProfile.getInputValues();
  popupWithFormEditProfile.changeButtonTextDuringLoading({loadingText: loadingText, primaryText: this.buttonSubmit.textContent});
  api.getDataOnRequestToServer({target: 'users/me', config1: {
    method: 'PATCH',
    body: JSON.stringify(
      {
      name: inputValues.name,
      about: inputValues.description
    })
  }})
    .then(updatedUserInfo => {
      user.setUserInfo({userInfo: updatedUserInfo});
      popupWithFormEditProfile.closePopup(evt);
    })
    .catch(error => {
      console.log(error);
    })
    .finally(() => {
      popupWithFormEditProfile.changeButtonTextDuringLoading({});
    })

}

function handleEditAvatarFormSubmit(evt) {
  evt.preventDefault();
  const inputValues = popupWithFormEditAvatar.getInputValues();
  popupWithFormEditAvatar.changeButtonTextDuringLoading({loadingText: loadingText, primaryText: this.buttonSubmit.textContent});
  api.getDataOnRequestToServer({target: 'users/me/avatar', config1: {
    method: 'PATCH',
    body: JSON.stringify(
      {
        avatar: inputValues.link
    })}})
    .then(updatedAvatarLink => {
      user.updateAvatar({link: updatedAvatarLink.avatar});
      popupWithFormEditAvatar.closePopup(evt);
    })
    .catch(error => {
    console.log(error);
    })
    .finally(() => {
      popupWithFormEditAvatar.changeButtonTextDuringLoading({});
    })
}
>>>>>>> 71c7814fd39284acc20cef4620907b9caf93440b


function addCardOnPage(evt) {
    evt.preventDefault();
    popupWithFormAddCard.changeButtonTextDuringLoading({loadingText: loadingText, primaryText: this.buttonSubmit.textContent});
    setTimeout(() => {
<<<<<<< HEAD
        
=======

>>>>>>> 71c7814fd39284acc20cef4620907b9caf93440b
        addCardOnServer({information: {name: inputNameCard.value, link: inputSourceImg.value}}, config)
        .then(card => {
            const cards = [];
            const cardObject = new Card({
<<<<<<< HEAD
                userId: user.user['_id'], 
                params: params, 
                api: api, 
                popupOpenImage: popupWithImageObject, 
                popupWithForm: popupConfirmDeleteObject
            });
            cards.push(cardObject.getCard({initialData: card}));
            
=======
                userId: user.user['_id'],
                params: params,
                api: api,
                popupOpenImage: popupWithImageObject,
                popupWithForm: popupConfirmDeleteObject
            });
            cards.push(cardObject.getCard({initialData: card}));

>>>>>>> 71c7814fd39284acc20cef4620907b9caf93440b
            const section = new Section({items: cards, renderer: insertCardOnPage}, cardItemsList);
            section.appendCardOnPage();
            popupWithFormAddCard.closePopup(evt);
        })
        .catch(error => {
            console.log(error);
        })
        .finally(() => {
            popupWithFormAddCard.changeButtonTextDuringLoading({});
        })
    }, 1);

}

function addCardOnServer(settings={
    information: {
<<<<<<< HEAD
        name: '', 
        link: ''
    }, config}
    ) {
        
=======
        name: '',
        link: ''
    }, config}
    ) {

>>>>>>> 71c7814fd39284acc20cef4620907b9caf93440b
        config.method = 'POST';
        config.body = JSON.stringify(
            {
            name: `${settings.information.name}`,
            link: `${settings.information.link}`
        }
        );
        return(
            api.getDataOnRequestToServer({
                target: 'cards',
                config1: config
            })
        );

<<<<<<< HEAD
=======
    }


>>>>>>> 71c7814fd39284acc20cef4620907b9caf93440b
function deleteCardFromServer(evt) {
    evt.preventDefault();
    popupConfirmDeleteObject.changeButtonTextDuringLoading({loadingText: loadingText, primaryText: this.buttonSubmit.textContent});
    api.getDataOnRequestToServer({target: `cards/${this.cardObject._card.cardId}`, config1: {
        method: 'DELETE'
    }})
    .then(data => {
        this.cardObject.removeCard();
        this.cardObject._popupWithForm.closePopup(evt);
        console.log('Карточка удалена');
    })
    .catch(error => {
        console.log('Карточка не удалена', error);
    })
    .finally(() => {
        popupConfirmDeleteObject.changeButtonTextDuringLoading({});
    })
    }

