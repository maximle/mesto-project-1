import {checkPromiseResponse} from './utils.js';


class Api {
    constructor({config}) {
        this._config = config;
        this.data = null;
        this._target = null;
        this._headers = null;
        this._card = null;
        this._cardElement = null;
    }

    _checkPromiseResponse(response) {
        if(response.ok) {
            
            return response.json();
        } else {
            return Promise.reject(`Ошибка: ${response.status} - ${response.statusText}`)
        }
    }

    _requestPromiseFromURL() {
        console.log(this._config.headers);
        if(this._config.baseUrl && this._config.cohortId && this._config.headers.authorization) {
            return (
                fetch(`${this._config.baseUrl}/${this._config.cohortId}/${this._target}`, {headers: this._config.headers})
            );
        } else {
            console.log('Не хватает свойств, переданных функции.');
        }
    }

    _deleteCardFromServer() {
        this._headers.method = 'DELETE';
        this.getDataOnRequestToServer({target: `cards/${this._cardObject._card.cardId}`})
        .then(data => {
            console.log('Карточка удалена');
            this._cardObject.removeCard();
            this._cardObject._popupWithForm.closePopup();
        })
        .catch(error => {
            console.log('Карточка не удалена', error);
        })
        }

    

    confirmDeleteCallback(evt) {
        evt.preventDefault();
        this._deleteCardFromServer();
    }

    setCardObject({cardObject}) {
        this._cardObject = cardObject;
    }

    getDataOnRequestToServer({target, headers}) {
        this._config.headers = Object.assign(this._config.headers, headers);
        this._target = target;
        return (
            this._requestPromiseFromURL()
            .then(this._checkPromiseResponse)
            .then(data => {
                this.data = data;
                return data;
            })
            .catch(error => {
                console.log(error);
                return false;
            })
        );  
    }

    // getDataOnRequestToServer({target, headers}) {
    //     this._config.headers = Object.assign(this._config.headers, headers);
    //     this._target = target;
    //     this._requestPromiseFromURL()
    //         .then(this._checkPromiseResponse)
    //         .then(data => {
    //             this.data = data;
    //             console.log('logggg', this.data);
    //             return data;
    //         })
    //         .catch(error => {
    //             console.log(error);
    //             return false;
    //         });  
    // return this.data;
}

    




//   const configTemplate = {
//     config: {
//         baseUrl: config.baseUrl, 
//         cohortId: config.cohortId,
//     }, 
//     options: {
//         headers: config.headers,
// }};
  

// function requestPromiseFromURL(settings={
//     config: {
//         baseUrl: null, 
//         cohortId: null,
//      }, 
//      options: {}}, 
//     target='') {
//     if(settings.config.baseUrl && settings.config.cohortId && settings.options.headers.authorization) {
//         return (
//             fetch(`${settings.config.baseUrl}/${settings.config.cohortId}/${target}`, settings.options)
//         );
//     } else {
//         console.log('Не хватает свойств, переданных функции.');
//     }
// }

// function getDataOnRequestToServer(settings={configForRequest: {}, targetLink: ''}) {
//     return (
//         requestPromiseFromURL(settings.configForRequest, settings.targetLink)
//         .then(checkPromiseResponse)
//         .then(data => {
//             return data;
//         })
//         .catch(error => {
//             console.log(error);
//             return false;
//         })
//     );  
// }

export {
    Api,
};
  