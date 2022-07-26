import './index.css';


import { 
    openPopup, 
    addEventSubmitForForm, 
    addEventForClosePopup,
    fillInitialValuesFields,
    closePopup,
    userName,
    userAbout,
} from './components/modal.js';
import { 
    enableValidationAllForms,
    checkValidityOfFields,
    toggleButtonSubmitState,
 } from './components/validate.js';
import {
    validationSettings, 
    userObject, 
    cardItemsList,
    changeButtonTextDuringLoading
} from './components/utils.js';
import { 
    config, 
    configTemplate,
    getDataOnRequestToServer,
} from './components/api.js';
import { 
    getCardObject, 
    insertCardInsideList,
    insertCardOnPage, 
    removeCard,
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

const inputLinkToAvatar = formEditAvatar.querySelector('.form__input-text');

const inputSourceImg = formAddCard.elements.description;
const inputNameCard = formAddCard.elements.name;

const profileAvatar = document.querySelector('.profile-section__avatar');

const loadingText = 'Сохранение...';


function confirmDeleteCallback(evt) {
    evt.preventDefault();
    deleteCardFromServer({objectHandler: this});
}

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
}


function deleteCardFromServer(settings={objectHandler: null}) {
    const configForRequest = configTemplate;
    configForRequest.options.method = 'DELETE';
    getDataOnRequestToServer({
        configForRequest: configForRequest,
        targetLink: `cards/${settings.objectHandler.cardObject.cardId}`,
    })
    .then(data => {
        console.log('Карточка удалена');
        removeCard(settings.objectHandler.cardElement);
        closePopup({objectHandler: settings.objectHandler});
        settings.objectHandler.buttonSubmit.removeEventListener('click', settings.objectHandler);
    })
    .catch(error => {
        console.log('Карточка не удалена', error);
    })
    }

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
            checkValidityOfFields(formAddCard, validationSettings);
            toggleButtonSubmitState(formAddCard, validationSettings);
            addEventForClosePopup({objectHandler: objectHandler});
            addEventSubmitForForm({objectHandler: objectHandler});

        });
        
        
        buttonEditProfile.addEventListener('click', () => {
            const objectHandler = {
                popup: popupEditProfile,
                formElement: formEditProfile, 
                handleEvent: handleProfileEditFormSubmit, 
                buttonSubmit: buttonSubmitFormEditProfile,
            };
            openPopup({popup: popupEditProfile});
            fillInitialValuesFields(formEditProfile);
            checkValidityOfFields(formEditProfile, validationSettings);
            toggleButtonSubmitState(formEditProfile, validationSettings);
            addEventForClosePopup({objectHandler: objectHandler});
            addEventSubmitForForm({objectHandler: objectHandler});

        });
        
        buttonEditAvatar.addEventListener('click', () => {
            const objectHandler = {
                popup: popupEditAvatar,
                formElement: formEditAvatar, 
                handleEvent: handleEditAvatarFormSubmit, 
                buttonSubmit: buttonSubmitFormEditAvatar,
            };
            openPopup({popup: popupEditAvatar});
            formEditAvatar.reset();
            checkValidityOfFields(formEditAvatar, validationSettings);
            toggleButtonSubmitState(formEditAvatar, validationSettings);
            addEventForClosePopup({objectHandler: objectHandler});
            addEventSubmitForForm({objectHandler: objectHandler});
        });
        
        
        enableValidationAllForms(validationSettings);

        console.log('Все нормально загрузилось');
    })
    .catch(errorArray => {
        console.log('Ошибка загрузки', errorArray);
    })







