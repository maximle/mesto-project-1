
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
        if(this._config.baseUrl && this._config.cohortId && this._config.headers.authorization) {
            return (
                fetch(`${this._config.baseUrl}/${this._config.cohortId}/${this._target}`, {
                    method: this._config.method,
                    headers: this._config.headers,
                    body: this._config.body
                })
            );
        } else {
            console.log('Не хватает свойств, переданных функции.');
        }
    }

    setCardObject({cardObject}) {
        this._cardObject = cardObject;
    }

    getDataOnRequestToServer({target, config1}) {
        this._config.method = config1.method;
        this._config.body = config1.body;
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

}

  
export {
    Api,
};
  