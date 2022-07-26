import {checkPromiseResponse} from './utils.js';



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
  

function requestPromiseFromURL(settings={
    config: {
        baseUrl: null, 
        cohortId: null,
     }, 
     options: {}}, 
    target='') {
    if(settings.config.baseUrl && settings.config.cohortId && settings.options.headers.authorization) {
        return (
            fetch(`${settings.config.baseUrl}/${settings.config.cohortId}/${target}`, settings.options)
        );
    } else {
        console.log('Не хватает свойств, переданных функции.');
    }
}

function getDataOnRequestToServer(settings={configForRequest: {}, targetLink: ''}) {
    return (
        requestPromiseFromURL(settings.configForRequest, settings.targetLink)
        .then(checkPromiseResponse)
        .then(data => {
            return data;
        })
        .catch(error => {
            console.log(error);
            return false;
        })
    );  
}

export {
    config, 
    configTemplate,
    getDataOnRequestToServer,
};
  