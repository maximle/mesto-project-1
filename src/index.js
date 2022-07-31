import './index.css';
import FormValidator from './components/FormValidator.js';
import Api from './components/Api.js';
import Card from './components/Card.js';
import { UserInfo } from './components/UserInfo.js';
import { Section } from './components/Section.js';
import { PopupWithImage } from './components/PopupWithImage.js';
import { PopupWithForm } from './components/PopupWithForm.js';
import {
    popupAddCardSelector,
    popupEditProfileSelector,
    popupEditAvatarSelector,
    popupImageSelector,
    popupConfirmDeleteSelector,
    formAddCard,
    formEditProfile,
    formEditAvatar,
    buttonAddCard,
    buttonEditProfile,
    buttonEditAvatar,
    profileAvatar,
    cardItemsList,
    loadingText,
    validationSettings,
    params,
    config,
    userName,
    userAbout
} from './utils/constants.js'

const cardPopupFromValidator = new FormValidator(formAddCard, validationSettings);
const userPopupFromValidator = new FormValidator(formEditProfile, validationSettings);
const avatarPopupFromValidator = new FormValidator(formEditAvatar, validationSettings);
cardPopupFromValidator.enableValidation();
userPopupFromValidator.enableValidation();
avatarPopupFromValidator.enableValidation();

const api = new Api({config});
const user = new UserInfo({nameSelector: userName, aboutSelector: userAbout, avatarSelector: profileAvatar});
const popupWithImageObject = new PopupWithImage({popupSelector: popupImageSelector});
const popupConfirmDeleteObject = new PopupWithForm({popupSelector: popupConfirmDeleteSelector, callbackSubmitForm: deleteCardFromServer});
const popupWithFormAddCard = new PopupWithForm({popupSelector: popupAddCardSelector, callbackSubmitForm: addCardOnPage});
const popupWithFormEditProfile = new PopupWithForm({popupSelector: popupEditProfileSelector, callbackSubmitForm: handleProfileEditFormSubmit});
const popupWithFormEditAvatar = new PopupWithForm({popupSelector: popupEditAvatarSelector, callbackSubmitForm: handleEditAvatarFormSubmit});
const section = new Section({renderer: insertCardOnPage}, cardItemsList);
const cardObject = new Card({
    params: params,
    api: api,
    popupOpenImage: popupWithImageObject,
    popupWithForm: popupConfirmDeleteObject
  });



Promise.all([
    api.getUserInfo(),
    api.getInitialCards()
  ])
    .then (([profileInfo, cardsArr]) => {
      console.log(profileInfo);
      user.setUserInfo({userInfo: profileInfo});
      cardObject.setUserId({userId: profileInfo['_id']});
      // const cards = cardObject.getCardsArray({initialDataArray: cardsArr});
      const cards = [];
      console.log(cardsArr);
      cardsArr.forEach(card => {
        cards.push(cardObject.getCard({initialData: card}));
      });
      section.appendCardOnPage({arrayData: cards});
      buttonAddCard.addEventListener('click', () => {
          popupWithFormAddCard.openPopup({});
          cardPopupFromValidator.resetValidation();
      })
      buttonEditProfile.addEventListener('click', () => {
          popupWithFormEditProfile.openPopup({inputData: {name: userName.textContent, description: userAbout.textContent}});
          userPopupFromValidator.resetValidation();
      })
      buttonEditAvatar.addEventListener('click', () => {
          popupWithFormEditAvatar.openPopup({});
          avatarPopupFromValidator.resetValidation();
      })
        console.log('Все нормально загрузилось');
      })
      .catch(errorArray => {
        console.log('Ошибка загрузки', errorArray);
    })

function handleProfileEditFormSubmit(evt) {
  evt.preventDefault();
  const inputValues = popupWithFormEditProfile.getInputValues();
  popupWithFormEditProfile.renderLoading(true);

  api.updateProfileInfo({inputValues: inputValues})
    .then(updatedUserInfo => {
      user.setUserInfo({userInfo: updatedUserInfo});
      popupWithFormEditProfile.closePopup(evt);
    })
    .catch(error => {
      console.log(error);
    })
    .finally(() => {
      popupWithFormEditProfile.renderLoading(false);
    })

}

function handleEditAvatarFormSubmit(evt) {
  evt.preventDefault();
  const inputValues = popupWithFormEditAvatar.getInputValues();
  popupWithFormEditAvatar.renderLoading(true);

  api.editProfileAvatar({inputValues: inputValues})
    .then(updatedAvatarLink => {
      user.setUserInfo({userInfo: updatedAvatarLink});
      popupWithFormEditAvatar.closePopup(evt);
    })
    .catch(error => {
    console.log(error);
    })
    .finally(() => {
      popupWithFormEditAvatar.renderLoading(false);
    })
}


function addCardOnPage(evt) {
    evt.preventDefault();
    const inputValues = popupWithFormAddCard.getInputValues();
    popupWithFormAddCard.renderLoading(true);
    setTimeout(() => {
        api.addCardToServer({inputValues: inputValues})
        .then(card => {
            console.log(card);
            const cardObj = cardObject.getCard({initialData: card})
            section.appendCardOnPage({arrayData: [cardObj]});
            popupWithFormAddCard.closePopup(evt);
        })
        .catch(error => {
            console.log(error);
        })
        .finally(() => {
            popupWithFormAddCard.renderLoading(false);
        })
    }, 1);
  }


function deleteCardFromServer(evt) {
    evt.preventDefault();
    popupConfirmDeleteObject.renderLoading(true);
    api.deleteCardFromServer({cardId: this.cardObject.cardId})
    .then(data => {
        console.log(this, 'asd');
        this.cardObject.removeCard();
        this.cardObject.popupWithForm.closePopup(evt);
        console.log('Карточка удалена');
    })
    .catch(error => {
        console.log('Карточка не удалена', error);
    })
    .finally(() => {
      popupConfirmDeleteObject.renderLoading(false);
    })
}

function insertCardOnPage(card) {
  return (
      checkLoadImageFromServer(card)
      .then(res => {
          return res;
      })
      .catch(err => {
          console.log(`Картинка не загрузилась. ${err}`);
      }));
}

function checkLoadImageFromServer(cardObject) {
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
