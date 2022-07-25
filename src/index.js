import './index.css';


import { 
    Section,
    PopupWithImage,
    PopupWithForm,
    insertCardOnPage
} from './components/modal.js';
import { 
    FormValidator
} from './components/validate.js';
import {
    validationSettings, 
    changeButtonTextDuringLoading
} from './components/utils.js';
import { 
    Api
} from './components/api.js';
import { 
    Card,
} from './components/card.js';


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
    },
    method: 'GET',
    body: null
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
        return (
            this._apiObject.getDataOnRequestToServer({target: 'users/me/avatar', config1: {
                method: 'PATCH',
                body: JSON.stringify(
                    {
                        avatar: link
                    }
                )
            }
            })
        )
        

    }

    getUserInfo() {
        return (
            this._apiObject.getDataOnRequestToServer({target: 'users/me', config1: {
                method: 'GET'
            }})
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
        return (
            this._apiObject.getDataOnRequestToServer({target: 'users/me', config1: {
                method: 'PATCH',
                body: JSON.stringify(
                    {
                    name: name,
                    about: about
                })
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
                );
            }
    }

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
        
        console.log('Все нормально загрузилось');
    })
    .catch(errorArray => {
        console.log('Ошибка загрузки', errorArray);
    })



function handleProfileEditFormSubmit(evt) {
    evt.preventDefault();
    changeButtonTextDuringLoading({
        button: this.buttonSubmit,
        loadingText: loadingText,
        primaryText: this.buttonSubmit.textContent,
    });
                 
    user.setUserInfo({
            name: this.formElement.elements.name.value,
            about: this.formElement.elements.description.value,})
        .then(res => {
            popupWithFormEditProfile.closePopup();
        })
        .catch(error => {
            console.log(error);
        })
        .finally(() => {
            changeButtonTextDuringLoading({button: this.buttonSubmit});
        })
    
}

function handleEditAvatarFormSubmit(evt) {
    evt.preventDefault();

    changeButtonTextDuringLoading({
        button: this.buttonSubmit,
        loadingText: loadingText,
        primaryText: this.buttonSubmit.textContent,
    });
        
    user.updateAvatar({link: inputLinkToAvatar.value})
        .then(userAvatar => {
            profileAvatar.src = userAvatar.avatar;
            popupWithFormEditAvatar.closePopup({objectHandler: this});
        })
        .catch(error => {
            console.log(error);
        })
        .finally(() => {
            changeButtonTextDuringLoading({button: this.buttonSubmit});
        })
        
    
    
}

function addCardOnPage(evt) {
    evt.preventDefault();
    
    changeButtonTextDuringLoading({
        button: this.buttonSubmit,
        loadingText: loadingText,
        primaryText: this.buttonSubmit.textContent,
    });
    
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
            popupWithFormAddCard.closePopup();
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
    changeButtonTextDuringLoading({
        button: this.buttonSubmit,
        loadingText: loadingText,
        primaryText: this.buttonSubmit.textContent,
    });
    api.getDataOnRequestToServer({target: `cards/${this.cardObject._card.cardId}`, config1: {
        method: 'DELETE'
    }})
    .then(data => {
        this.cardObject.removeCard();
        this.cardObject._popupWithForm.closePopup();
        console.log('Карточка удалена');
    })
    .catch(error => {
        console.log('Карточка не удалена', error);
    })
    .finally(() => {
        changeButtonTextDuringLoading({button: this.buttonSubmit});
    })
    }

