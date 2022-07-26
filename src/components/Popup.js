export const userName = document.querySelector('.profile-section__name');
export const userAbout = document.querySelector('.profile-section__text');

export default class Popup {
    constructor({selectorPopup}) {
        this._selectorPopup = selectorPopup;
        this._buttonClose = this._selectorPopup.querySelector('.popup__close');
        this.boundClosePopup = this.closePopup.bind(this);
        this.bound_closePopupToKey = this._closePopupToKey.bind(this);
        this.bound_closePopupToOverlay = this._closePopupToOverlay.bind(this);
    }
    
    _removeEventListeners(evt) {
        const popup = evt.target.closest('.popup');
        console.log(evt.target, popup);
        popup.removeEventListener('click', this.bound_closePopupToOverlay);
        popup.querySelector('.popup__close').removeEventListener('click', this.boundClosePopup);
        document.removeEventListener('keydown', this.bound_closePopupToKey);
    }

    _closePopupToKey(evt) {
        if (evt.key === 'Escape') {
            const popup = document.querySelector('.popup_opened');
            if(popup) {
                this.closePopup(evt);
            }
        }
    }
    
    _closePopupToOverlay(evt) {
        if (!(evt.target.closest('.popup__container'))) {
            this.closePopup(evt);
        }
    }

    closePopup(evt) {
        this._selectorPopup.classList.remove('popup_opened');
        this._removeEventListeners(evt);
        console.log(this);
    }

    openPopup() {
        console.log(this);
        this._selectorPopup.classList.add('popup_opened');
        this.setEventListener();
    }

    setEventListener() {
        this._buttonClose.addEventListener('click', this.boundClosePopup);
        document.addEventListener('keydown', this.bound_closePopupToKey);
        this._selectorPopup.addEventListener('click', this.bound_closePopupToOverlay);
    }
}

function insertCardOnPage(card) {   
        return (
            checkLoadImageFromServer(card)                    
            .then(res => {                                     
                return res;      
            })                                                  
            .catch(err => {
                console.log(`Картинка не загрузилась. ${err}`);
            }));
}

function checkLoadImageFromServer(cardObject) {
    return new Promise(function(resolve, reject) {
        const image = document.createElement('img');
        
        image.src = cardObject.cardImg.src;
        image.onerror = function() {
            reject(cardObject);
        };
        image.onload = function() {
            resolve(cardObject);
        };
    });
  }


export {
    insertCardOnPage,
    Popup
}