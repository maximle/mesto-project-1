import './index.css';


import { 
    Section,
    PopupWithImage,
    PopupWithForm,
    Popup,
    insertCardOnPage
} from './components/modal.js';
import { 
    FormValidator
} from './components/validate.js';
import {
    validationSettings, 
    userObject, 
    changeButtonTextDuringLoading
} from './components/utils.js';
import { 
    Api
} from './components/api.js';
import { 
    removeCard,
    Card,
} from './components/card.js';


const popupAddCard = document.querySelector('#addCard');
const popupEditProfile = document.querySelector('#editProfile');
const popupEditAvatar = document.querySelector('#editAvatar');
const popupImage = document.querySelector('#openImage');
const popupConfirmDelete = document.querySelector('#confirmDelete');

const formAddCard = popupAddCard.querySelector('#formAddCard');
console.log(formAddCard);
const cardPopupFromValidator = new FormValidator(formAddCard, validationSettings);
const formEditProfile = popupEditProfile.querySelector('#formEditPofile');
const formEditAvatar = popupEditAvatar.querySelector('#formEditAvatar');
const userPopupFromValidator = new FormValidator(formEditProfile, validationSettings);
const avatarPopupFromValidator = new FormValidator(formEditAvatar, validationSettings);

const buttonSubmitFormAddCard = formAddCard.querySelector('.form__save');
const buttonSubmitFormEditProfile = formEditProfile.querySelector('.form__save');
const buttonSubmitFormEditAvatar = formEditAvatar.querySelector('.form__save');

const buttonAddCard = document.querySelector('.profile-section__add');
const buttonEditProfile = document.querySelector('.profile-section__edit');
const buttonEditAvatar = document.querySelector('.profile-section__edit-avatar');

const inputLinkToAvatar = formEditAvatar.querySelector('.form__input-text');

const inputSourceImg = formAddCard.elements.description;
const inputNameCard = formAddCard.elements.name;

const profileAvatar = document.querySelector('.profile-section__avatar');
const cardItemsList = document.querySelector('.photo-grid__items');

const userName = document.querySelector('.profile-section__name');
const userAbout = document.querySelector('.profile-section__text');

const loadingText = 'Сохранение...';

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
    }
    }

const cards = [];


class UserInfo {
    constructor({nameSelector, aboutSelector, avatarSelector}, apiObject) {
        this._nameSelector = nameSelector;
        this._aboutSelector = aboutSelector;
        this._avatarSelector = avatarSelector;
        this._apiObject = apiObject;
        this.user = {};
    }

    updateAvatar({link}) {
        this._apiObject.getDataOnRequestToServer({target: 'users/me/avatar', headers: {
            method: 'PATCH',
            body: JSON.stringify(
                {
                avatar: `${link}`,
            })
        }
    })

    }

    getUserInfo() {
        return (
            this._apiObject.getDataOnRequestToServer({target: 'users/me'})
            .then(user => {
                this._avatarSelector.src = user.avatar;
                this._nameSelector.textContent = user.name;
                this._aboutSelector.textContent = user.about;
                this.user.avatar = user.avatar;
                this.user.name = user.name;
                this.user.description = user.about;
                this.user['_id'] = user['_id'];
                return this.user;
                })
            .catch(error => {
                console.log(error);
                return error;
            })
        );
        }

    setUserInfo({name, about}) {
        this._apiObject.getDataOnRequestToServer({target: 'users/me', headers: {
            method: 'PATCH',
            body: JSON.stringify(
                {
                name: `${name}`,
                about: `${about}`
            }
            )
        }})
            .then(updatedUser => {
                this._nameSelector.textContent = updatedUser.name;
                this._aboutSelector.textContent = updatedUser.about;

                this.user.name = updatedUser.name;
                this.user.description = updatedUser.about;
                this.user.avatar = updatedUser.avatar;
                this.user['_id'] = updatedUser['_id'];
                console.log('Данные обновлены');
                return updatedUser;
            })
            .catch(error => {
                return error;
            })
        }
    }

const api = new Api({config});
const user = new UserInfo({nameSelector: userName, aboutSelector: userAbout, avatarSelector: profileAvatar}, api);
const popupWithImageObject = new PopupWithImage({selectorPopup: popupImage});
const popupConfirmDeleteObject = new PopupWithForm({selectorPopup: popupConfirmDelete});
const popupWithFormAddCard = new PopupWithForm({selectorPopup: popupAddCard, callbackSubmitForm: addCardOnPage});
const popupWithFormEditProfile = new PopupWithForm({selectorPopup: popupEditProfile, callbackSubmitForm: handleProfileEditFormSubmit});
const popupWithFormEditAvatar = new PopupWithForm({selectorPopup: popupEditAvatar, callbackSubmitForm: handleEditAvatarFormSubmit});

const listCards = api.getDataOnRequestToServer({target: 'cards'})
    .then(res => {
        res.forEach(card => {
            const cardObject = new Card({
                userId: user['_id'], 
                params: params, 
                api: api, 
                popupOpenImage: popupWithImageObject, 
                popupWithForm: popupConfirmDeleteObject
            });
            cards.push(cardObject.getCard({initialData: card}));
            })
        const section = new Section({items: cards, renderer: insertCardOnPage}, cardItemsList);
        section.appendCardOnPage();
        return true;
    })
    .catch(err => {
        console.log(`Ошибка: ${err}`);
        return false;
    })


console.log(popupWithFormAddCard._buttonClose);


Promise.all([
    user.getUserInfo(),
    listCards,
])
    .then(arrayData => {
        buttonAddCard.addEventListener('click', () => {
            popupWithFormAddCard.openPopup({});
            formAddCard.reset();
            cardPopupFromValidator.enableValidation();
        });
        
        
        buttonEditProfile.addEventListener('click', () => {
            popupWithFormEditProfile.openPopup({withInitialValuesFields: true});
            userPopupFromValidator.enableValidation();
        });
        
        buttonEditAvatar.addEventListener('click', () => {
            popupWithFormEditAvatar.openPopup({});
            formEditAvatar.reset();
            avatarPopupFromValidator.enableValidation();
        });
        
        
        enableValidationAllForms(validationSettings);

        console.log('Все нормально загрузилось');
    })
    .catch(errorArray => {
        console.log('Ошибка загрузки', errorArray);
    })



// function confirmDeleteCallback(evt) {
//     evt.preventDefault();
//     deleteCardFromServer({objectHandler: this});
// }

function handleProfileEditFormSubmit(evt) {
    evt.preventDefault();
    changeButtonTextDuringLoading({
        button: this.buttonSubmit,
        loadingText: loadingText,
        primaryText: this.buttonSubmit.textContent,
    });
    setTimeout(() => {   // DOM не успевает перерисоваться              
        updateProfileInformation({
            information: {
                name: this.formElement.elements.name.value,
                description: this.formElement.elements.description.value,
            }
        })
        .then(res => {
            console.log(res);
            closePopup({objectHandler: this});
        })
        .catch(error => {
            console.log(error);
        })
        .finally(() => {
            changeButtonTextDuringLoading({button: this.buttonSubmit});
        })
    }, 1);
}

function handleEditAvatarFormSubmit(evt) {
    evt.preventDefault();

    changeButtonTextDuringLoading({
        button: this.buttonSubmit,
        loadingText: loadingText,
        primaryText: this.buttonSubmit.textContent,
    });

    setTimeout(() => {   // DOM не успевает перерисоваться  
        
        updateAvatar({link: inputLinkToAvatar.value})
        .then(userAvatar => {
            profileAvatar.src = userAvatar.avatar;
            closePopup({objectHandler: this});
        })
        .catch(error => {
            console.log(error);
        })
        .finally(() => {
            changeButtonTextDuringLoading({button: this.buttonSubmit});
        })
        
    }, 1);
    
}

function addCardOnPage(evt) {
    evt.preventDefault();
    
    changeButtonTextDuringLoading({
        button: this.buttonSubmit,
        loadingText: loadingText,
        primaryText: this.buttonSubmit.textContent,
    });
    
    setTimeout(() => {
        
        addCardOnServer({information: {name: inputNameCard.value, link: inputSourceImg.value}})
        .then(card => {
            const cardObject = getCardObject(card, userObject['_id'], confirmDeleteCallback);
            insertCardInsideList(cardObject, cardItemsList);
            closePopup({objectHandler: this});
        })
        .catch(error => {
            console.log(error);
        })
        .finally(() => {
            changeButtonTextDuringLoading({button: this.buttonSubmit});
        })
    }, 1);
    
}

function addCardOnServer(settings={
    information: {
        name: '', link: ''
    }}
    ) {
        const configForRequest = configTemplate;
        configForRequest.options.method = 'POST';
        configForRequest.options.body = JSON.stringify(
            {
            name: `${settings.information.name}`,
            link: `${settings.information.link}`
        }
        );
        return(
            getDataOnRequestToServer({
                configForRequest: configForRequest,
                targetLink: 'cards',
            })
        );
        
    }




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
        

//         console.log('Все нормально загрузилось');
//     })
//     .catch(errorArray => {
//         console.log('Ошибка загрузки', errorArray);
//     })







