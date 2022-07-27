import './index.css';
import FormValidator from './components/FormValidator.js';
import Api from './components/Api.js';
import Card from './components/Card.js';
import { UserInfo } from './components/UserInfo.js';
import { Section } from './components/Section.js';
import { insertCardOnPage, userName, userAbout } from './components/Popup.js';
import { PopupWithImage } from './components/PopupWithImage.js';
import { PopupWithForm } from './components/PopupWithForm.js';
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


function addCardOnPage(evt) {
    evt.preventDefault();
    popupWithFormAddCard.changeButtonTextDuringLoading({loadingText: loadingText, primaryText: this.buttonSubmit.textContent});
    setTimeout(() => {

        addCardOnServer({information: {name: inputNameCard.value, link: inputSourceImg.value}}, config)
        .then(card => {
            const cards = [];
            const cardObject = new Card({
                userId: user.user['_id'],
                params: params,
                api: api,
                popupOpenImage: popupWithImageObject,
                popupWithForm: popupConfirmDeleteObject
            });
            cards.push(cardObject.getCard({initialData: card}));

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
        name: '',
        link: ''
    }, config}
    ) {

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

    }


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

