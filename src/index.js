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

<<<<<<< HEAD



<<<<<<< HEAD
function updateProfileInformation(settings={
    information: {
        name: '', description: ''
    }}
    ) {

        const configForRequest = configTemplate;
        configForRequest.options.method = 'PATCH';
        configForRequest.options.body = JSON.stringify(
            {
            name: `${settings.information.name}`,
            about: `${settings.information.description}`
        }
        );
        return(
            getDataOnRequestToServer({
                configForRequest: configForRequest,
                targetLink: 'users/me',
            })
            .then(updatedUser => {
                userName.textContent = updatedUser.name;
                userAbout.textContent = updatedUser.about;

                userObject.name = updatedUser.name;
                userObject.description = updatedUser.about;
                userObject.avatar = updatedUser.avatar;
                userObject['_id'] = updatedUser['_id'];
                return updatedUser;
            })
            .catch(error => {
                return error;
            })
        );
=======
>>>>>>> 02275a6c4a4a229f9a6cf2aff978877583629152
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
<<<<<<< HEAD

function updateAvatar(settings={link: ''}) {
    const configForRequest = configTemplate;
    configForRequest.options.method = 'PATCH';
    configForRequest.options.body = JSON.stringify(
        {
        avatar: `${settings.link}`,
    }
    );
    return(
        getDataOnRequestToServer({
            configForRequest: configForRequest,
            targetLink: 'users/me/avatar',
        })
    );
}

function getUser(settings={idUser: false, isMe: false}) {
    const configForRequest = configTemplate;
    if(settings.isMe) {
        return (
            getDataOnRequestToServer({
                configForRequest: configForRequest,
                targetLink: 'users/me',
            })
            .then(user => {
                    profileAvatar.src = user.avatar;
                    userName.textContent = user.name;
                    userAbout.textContent = user.about;
                    userObject.avatar = user.avatar;
                    userObject.name = user.name;
                    userObject.description = user.about;
                    userObject['_id'] = user['_id'];
                    return user;
                })
            .catch(error => {
                console.log(error);
                return error;
            })
        );
    }
  }

function getCards(settings={confirmDeleteCallback: null}) {           
    const configForRequest = configTemplate;
    return (
        getDataOnRequestToServer({
            configForRequest: configForRequest,
            targetLink: 'cards',
        })
        .then(arrayCards => {                    // Получаю массив карточек, которые нужно отрисовать и вызываю колбек ->
            arrayCards.forEach(card => {
                insertCardOnPage({card: card, confirmDeleteCallback: settings.confirmDeleteCallback});
            });
            return arrayCards;
        })
        .catch(error => {
            console.log(error);
            return error;
        })
    );
}

Promise.all([
    getUser({config: config, isMe: true}),
    getCards({confirmDeleteCallback: confirmDeleteCallback}),
])
    .then(arrayData => {
        buttonAddCard.addEventListener('click', () => {
            const objectHandler = {
                popup: popupAddCard,
                formElement: formAddCard, 
                handleEvent: addCardOnPage, 
                buttonSubmit: buttonSubmitFormAddCard,
            };
            openPopup({popup: popupAddCard});
            formAddCard.reset();
            addEventForClosePopup({objectHandler: objectHandler});
            addEventSubmitForForm({objectHandler: objectHandler});
            cardPopupFromValidator.enableValidation();

        });
=======
// function updateProfileInformation(settings={
//     information: {
//         name: '', description: ''
//     }}
//     ) {

//         const configForRequest = configTemplate;
//         configForRequest.options.method = 'PATCH';
//         configForRequest.options.body = JSON.stringify(
//             {
//             name: `${settings.information.name}`,
//             about: `${settings.information.description}`
//         }
//         );
//         return(
//             getDataOnRequestToServer({
//                 configForRequest: configForRequest,
//                 targetLink: 'users/me',
//             })
//             .then(updatedUser => {
//                 userName.textContent = updatedUser.name;
//                 userAbout.textContent = updatedUser.about;

//                 userObject.name = updatedUser.name;
//                 userObject.description = updatedUser.about;
//                 userObject.avatar = updatedUser.avatar;
//                 userObject['_id'] = updatedUser['_id'];
//                 return updatedUser;
//             })
//             .catch(error => {
//                 return error;
//             })
//         );
// }


// function deleteCardFromServer(settings={objectHandler: null}) {
//     const configForRequest = configTemplate;
//     configForRequest.options.method = 'DELETE';
//     getDataOnRequestToServer({
//         configForRequest: configForRequest,
//         targetLink: `cards/${settings.objectHandler.cardObject.cardId}`,
//     })
//     .then(data => {
//         console.log('Карточка удалена');
//         removeCard(settings.objectHandler.cardElement);
//         closePopup({objectHandler: settings.objectHandler});
//         settings.objectHandler.buttonSubmit.removeEventListener('click', settings.objectHandler);
//     })
//     .catch(error => {
//         console.log('Карточка не удалена', error);
//     })
//     }

// function updateAvatar(settings={link: ''}) {
//     const configForRequest = configTemplate;
//     configForRequest.options.method = 'PATCH';
//     configForRequest.options.body = JSON.stringify(
//         {
//         avatar: `${settings.link}`,
//     }
//     );
//     return(
//         getDataOnRequestToServer({
//             configForRequest: configForRequest,
//             targetLink: 'users/me/avatar',
//         })
//     );
// }

// function getUser(settings={idUser: false, isMe: false}) {
//     const configForRequest = configTemplate;
//     if(settings.isMe) {
//         return (
//             getDataOnRequestToServer({
//                 configForRequest: configForRequest,
//                 targetLink: 'users/me',
//             })
//             .then(user => {
//                     profileAvatar.src = user.avatar;
//                     userName.textContent = user.name;
//                     userAbout.textContent = user.about;
//                     userObject.avatar = user.avatar;
//                     userObject.name = user.name;
//                     userObject.description = user.about;
//                     userObject['_id'] = user['_id'];
//                     return user;
//                 })
//             .catch(error => {
//                 console.log(error);
//                 return error;
//             })
//         );
//     }
//   }

// function getCards(settings={confirmDeleteCallback: null}) {           
//     const configForRequest = configTemplate;
//     return (
//         getDataOnRequestToServer({
//             configForRequest: configForRequest,
//             targetLink: 'cards',
//         })
//         .then(arrayCards => {                    // Получаю массив карточек, которые нужно отрисовать и вызываю колбек ->
//             arrayCards.forEach(card => {
//                 insertCardOnPage({card: card, confirmDeleteCallback: settings.confirmDeleteCallback});
//             });
//             return arrayCards;
//         })
//         .catch(error => {
//             console.log(error);
//             return error;
//         })
//     );
// }

// Promise.all([
//     getUser({config: config, isMe: true}),
//     getCards({confirmDeleteCallback: confirmDeleteCallback}),
// ])
//     .then(arrayData => {
//         buttonAddCard.addEventListener('click', () => {
//             const objectHandler = {
//                 popup: popupAddCard,
//                 formElement: formAddCard, 
//                 handleEvent: addCardOnPage, 
//                 buttonSubmit: buttonSubmitFormAddCard,
//             };
//             openPopup({popup: popupAddCard});
//             formAddCard.reset();
//             checkValidityOfFields(formAddCard, validationSettings);
//             toggleButtonSubmitState(formAddCard, validationSettings);
//             addEventForClosePopup({objectHandler: objectHandler});
//             addEventSubmitForForm({objectHandler: objectHandler});

//         });
>>>>>>> ca3cc1b7af36da9b9da0f4e77930142ee7b42fc4
        
        
//         buttonEditProfile.addEventListener('click', () => {
//             const objectHandler = {
//                 popup: popupEditProfile,
//                 formElement: formEditProfile, 
//                 handleEvent: handleProfileEditFormSubmit, 
//                 buttonSubmit: buttonSubmitFormEditProfile,
//             };
//             openPopup({popup: popupEditProfile});
//             fillInitialValuesFields(formEditProfile);
//             checkValidityOfFields(formEditProfile, validationSettings);
//             toggleButtonSubmitState(formEditProfile, validationSettings);
//             addEventForClosePopup({objectHandler: objectHandler});
//             addEventSubmitForForm({objectHandler: objectHandler});

//         });
        
//         buttonEditAvatar.addEventListener('click', () => {
//             const objectHandler = {
//                 popup: popupEditAvatar,
//                 formElement: formEditAvatar, 
//                 handleEvent: handleEditAvatarFormSubmit, 
//                 buttonSubmit: buttonSubmitFormEditAvatar,
//             };
//             openPopup({popup: popupEditAvatar});
//             formEditAvatar.reset();
//             checkValidityOfFields(formEditAvatar, validationSettings);
//             toggleButtonSubmitState(formEditAvatar, validationSettings);
//             addEventForClosePopup({objectHandler: objectHandler});
//             addEventSubmitForForm({objectHandler: objectHandler});
//         });
        
        
<<<<<<< HEAD
        // enableValidationAllForms(validationSettings);
=======
//         enableValidationAllForms(validationSettings);
>>>>>>> ca3cc1b7af36da9b9da0f4e77930142ee7b42fc4

//         console.log('Все нормально загрузилось');
//     })
//     .catch(errorArray => {
//         console.log('Ошибка загрузки', errorArray);
//     })







=======
>>>>>>> 02275a6c4a4a229f9a6cf2aff978877583629152
