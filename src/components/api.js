import {checkPromiseResponse, requestPromiseFromURL, userObject, getDataOnRequestToServer} from './utils.js';

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

function getCards() {
    const configForRequest = configTemplate;
    return (
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

        return (
            getDataOnRequestToServer({
                configForRequest: configForRequest,
                targetLink: 'users/me',
            })
        );
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


function deleteCardFromServer(idObj) {
    const configForRequest = configTemplate;
    configForRequest.options.method = 'DELETE';
    getDataOnRequestToServer({
        configForRequest: configForRequest,
        targetLink: `cards/${idObj}`,
    })
    }


function likeCard(settings={cardObject: {}, deleteLike: false}) {
    const configForRequest = configTemplate;
    if(settings.deleteLike) {
        configForRequest.options.method = 'DELETE';
    } else {
        configForRequest.options.method = 'PUT';
    }
    return (
        getDataOnRequestToServer({
            configForRequest: configForRequest,
            targetLink: `cards/likes/${settings.cardObject.cardId}`,
        })
    );    
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
  