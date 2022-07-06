import {userObject, getDataOnRequestToServer} from './utils.js';
import {changeColorLikeButton, insertCardOnPage, removeCard} from './card.js';
import {profileName, profileDescription, closePopup} from './modal.js';


const config = {
    baseUrl: 'https://mesto.nomoreparties.co/v1',
    cohortId: 'plus-cohort-13',
    headers: {
      authorization: 'e4d16501-e8d2-438e-96b5-6b9c94c85c98',
      'Content-Type': 'application/json'
    }
  }

  const configTemplate = {
    config: {
        baseUrl: config.baseUrl, 
        cohortId: config.cohortId,
    }, 
    options: {
        headers: config.headers,
}};
  

function getUser(settings={idUser: false, isMe: false}) {
    const configForRequest = configTemplate;
    if(settings.isMe) {
        return (
            getDataOnRequestToServer({
                configForRequest: configForRequest,
                targetLink: 'users/me',
            })
        );
    }
  }

function getCards(settings={confirmDeleteCallback: null}) {           
    const configForRequest = configTemplate;
        getDataOnRequestToServer({
            configForRequest: configForRequest,
            targetLink: 'cards',
        })
        .then(arrayCards => {                    // Получаю массив карточек, которые нужно отрисовать и вызываю колбек ->
            arrayCards.forEach(card => {
                insertCardOnPage({card: card, confirmDeleteCallback: settings.confirmDeleteCallback});
            });
        })
        .catch(error => {
            console.log(error);
        })
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

            getDataOnRequestToServer({
                configForRequest: configForRequest,
                targetLink: 'users/me',
            })
            .then(updatedUser => {
                profileName.textContent = updatedUser.name;
                profileDescription.textContent = updatedUser.about;

                userObject.name = updatedUser.name;
                userObject.description = updatedUser.about;
                userObject.avatar = updatedUser.avatar;
                userObject['_id'] = updatedUser['_id'];
            })
            .catch(error => {
                console.log(error);
            })

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


function deleteCardFromServer(settings={
    idObj: null,
    cardElement: null,
    handlerObject: null,
    buttonSubmit: null,
}) {
    const configForRequest = configTemplate;
    configForRequest.options.method = 'DELETE';
    getDataOnRequestToServer({
        configForRequest: configForRequest,
        targetLink: `cards/${settings.idObj}`,
    })
    .then(data => {
        console.log('Карточка удалена');
        removeCard(settings.cardElement);
    })
    .catch(error => {
        console.log('Карточка не удалена', error);
    })
    .finally(() => {
        settings.buttonSubmit.removeEventListener('click', settings.handlerObject);
        closePopup({popup: settings.handlerObject.popup});
    })
    }


function likeCard(evt) {
    const configForRequest = configTemplate;
    if(evt.target.classList.contains('photo-grid__like-icon_active')) {
        configForRequest.options.method = 'DELETE';
    } else {
        configForRequest.options.method = 'PUT';
    }
    
    getDataOnRequestToServer({
        configForRequest: configForRequest,
        targetLink: `cards/likes/${this.cardObject.cardId}`,
    })
        .then(card => {
            this.cardObject.likes.textContent = card.likes.length;
            changeColorLikeButton(this.cardObject);
        })
        .catch(error => {
            console.log(error);
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

export {
    config, 
    getUser, 
    getCards, 
    updateProfileInformation, 
    addCardOnServer, 
    deleteCardFromServer,
    likeCard,
    updateAvatar,
};
  