import './index.css';
import FormValidator from './components/FormValidator.js';
import Api from './components/Api.js';
import Card from './components/Card.js';
import { UserInfo } from './components/UserInfo.js';
import { Section } from './components/Section.js';
import { insertCardOnPage, userName, userAbout } from './components/Popup.js';
import { PopupWithImage } from './components/PopupWithImage.js';
import { PopupWithForm } from './components/PopupWithForm.js';
import { 
    popupAddCard, 
    popupEditProfile, 
    popupEditAvatar, 
    popupImage, 
    popupConfirmDelete, 
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
    config 
} from './utils/constants.js'

const cardPopupFromValidator = new FormValidator(formAddCard, validationSettings);
const userPopupFromValidator = new FormValidator(formEditProfile, validationSettings);
const avatarPopupFromValidator = new FormValidator(formEditAvatar, validationSettings);
cardPopupFromValidator.enableValidation();
userPopupFromValidator.enableValidation();
avatarPopupFromValidator.enableValidation();

const api = new Api({config});
const user = new UserInfo({nameSelector: userName, aboutSelector: userAbout, avatarSelector: profileAvatar});
const popupWithImageObject = new PopupWithImage({selectorPopup: popupImage});
const popupConfirmDeleteObject = new PopupWithForm({selectorPopup: popupConfirmDelete, callbackSubmitForm: deleteCardFromServer});
const popupWithFormAddCard = new PopupWithForm({selectorPopup: popupAddCard, callbackSubmitForm: addCardOnPage});
const popupWithFormEditProfile = new PopupWithForm({selectorPopup: popupEditProfile, callbackSubmitForm: handleProfileEditFormSubmit});
const popupWithFormEditAvatar = new PopupWithForm({selectorPopup: popupEditAvatar, callbackSubmitForm: handleEditAvatarFormSubmit});
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
      user.setUserInfo({userInfo: profileInfo});
      cardObject.setUserId({userId: profileInfo['_id']});
      const cards = cardObject.getCardsArray({initialDataArray: cardsArr});
      section.appendCardOnPage({arrayData: cards});
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

  api.updateProfileInfo({inputValues: inputValues})
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

  api.editProfileAvatar({inputValues: inputValues})
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


function addCardOnPage(evt) {
    evt.preventDefault();
    const inputValues = popupWithFormAddCard.getInputValues();
    popupWithFormAddCard.changeButtonTextDuringLoading({loadingText: loadingText, primaryText: this.buttonSubmit.textContent});
    setTimeout(() => {
        api.addCardToServer({inputValues: inputValues})
        .then(card => {
            const cardObj = cardObject.getCard({initialData: card})
            section.appendCardOnPage({arrayData: [cardObj]});
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


function deleteCardFromServer(evt) {
    evt.preventDefault();
    popupConfirmDeleteObject.changeButtonTextDuringLoading({loadingText: loadingText, primaryText: this.buttonSubmit.textContent});
    api.deleteCardFromServer({cardId: this.cardObject.cardId})
    .then(data => {
        this.cardObject.removeCard();
        this.cardObject.popupWithForm.closePopup(evt);
        console.log('Карточка удалена');
    })
    .catch(error => {
        console.log('Карточка не удалена', error);
    })
    .finally(() => {
        popupConfirmDeleteObject.changeButtonTextDuringLoading({});
    })
    }
