import {checkPromiseResponse, requestPromiseFromURL, userObject} from './utils.js';

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
        method: '',
        headers: config.headers,
        body: null
}};
  

function getUser(settings={idUser: false, isMe: false}) {
    if(settings.isMe) {
        return (
            requestPromiseFromURL({config: {
                baseUrl: config.baseUrl,
                cohortId: config.cohortId
            },
            options: {
                headers: config.headers,
            }
            }, 'users/me')
            .then(checkPromiseResponse)
            .then(user => {
                return user;
            })
            .catch(error => {
                console.log(error);
                return false;
            })
        );
    }
  }

function getCards() {
    return (
        requestPromiseFromURL({
            config: {
                baseUrl: config.baseUrl,
                cohortId: config.cohortId
        },
        options: {
            headers: config.headers,
        }
        }, 'cards')
        .then(checkPromiseResponse)
        .then(arrayCards => {
            return arrayCards;
        })
        .catch(error => {
            console.log(error);
            return false;
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


        requestPromiseFromURL(configForRequest, 'users/me')
            .then(checkPromiseResponse)
            .then(updatedUser => {
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
            requestPromiseFromURL(configForRequest, 'cards')
            .then(checkPromiseResponse)
            .then(card => {
                return card;
            })
            .catch(error => {
                console.log(error);
                return false;
            })
        );
        
    }

export {config, getUser, getCards, updateProfileInformation, addCardOnServer};
  