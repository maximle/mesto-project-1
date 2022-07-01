import {checkPromiseResponse, requestPromiseFromURL} from './utils.js';

const config = {
    baseUrl: 'https://mesto.nomoreparties.co/v1',
    cohortId: 'plus-cohort-13',
    headers: {
      authorization: 'e4d16501-e8d2-438e-96b5-6b9c94c85c98',
      'Content-Type': 'application/json'
    }
  }


function getUser(settings={idUser: false, isMe: false}) {
    if(settings.isMe) {
        return (
            requestPromiseFromURL(config, 'users/me')
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


export {config, getUser};
  