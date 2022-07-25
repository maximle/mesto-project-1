export const userName = document.querySelector('.profile-section__name');
export const userAbout = document.querySelector('.profile-section__text');


class Popup {
    constructor({selectorPopup}) {
        this._selectorPopup = selectorPopup;
        this._buttonClose = this._selectorPopup.querySelector('.popup__close');
        this._eventObjectCloseButton = {};
        this._eventObjectCloseOverlay = {};
        this._eventObjectCloseKey = {};
    }

    _addEventToKeyForClose() {
        this._eventObjectCloseKey.handleEvent = this._closePopupToKey;
        document.addEventListener('keydown', this._eventObjectCloseKey);     
    }
    
    _closePopupToKey(evt) {
        if (evt.key === 'Escape') {
            const popup = document.querySelector('.popup_opened');
            if(popup) {
                this.obj.closePopup();
            }
        }
    }

    _addEventToOverlayForClose() {
        this._eventObjectCloseOverlay.handleEvent = this._closePopupToOverlay;
        this._selectorPopup.addEventListener('click', this._eventObjectCloseOverlay);
    }
    
    _closePopupToOverlay(evt) {
        if (!(evt.target.closest('.popup__container'))) {
            this.obj.closePopup();
        }
    }

    _closePopupToButton(evt) {
        this.obj.closePopup();
    }

    _addEventForCloseButton() {
        this._eventObjectCloseButton.handleEvent = this._closePopupToButton;
        this._buttonClose.addEventListener('click', this._eventObjectCloseButton);
    }

    _removeEventForCloseButton() {
        this._buttonClose.removeEventListener('click', this._eventObjectCloseButton);
    }
    
    _removeEventForCloseToOverlay() {
        this._selectorPopup.removeEventListener('click', this._eventObjectCloseOverlay);
    }
    
    _removeEventForCloseToKey() {
        document.removeEventListener('keydown', this._eventObjectCloseKey);
    }

    closePopup() {
        this._selectorPopup.classList.remove('popup_opened');
        this._removeEventForCloseButton();
        this._removeEventForCloseToOverlay();
        this._removeEventForCloseToKey();
    }

    openPopup() {
        this._selectorPopup.classList.add('popup_opened');
        this._eventObjectCloseButton.obj = this;
        this._eventObjectCloseOverlay.obj = this;
        this._eventObjectCloseKey.obj = this;
        this.setEventListener();
    }

    setEventListener() {
        this._addEventForCloseButton();
        this._addEventToOverlayForClose();
        this._addEventToKeyForClose();
    }
}


class PopupWithForm extends Popup {
    constructor({selectorPopup, callbackSubmitForm}) {
        super({selectorPopup: selectorPopup});
        this._callbackSubmitForm = callbackSubmitForm;
        this._buttonSubmit = this._selectorPopup.querySelector('.form__save');
        this._formElement = this._selectorPopup.querySelector('.form');
        this._cardElement = null;
        this._cardObject = null;
        this._primaryTextButton = '';
        this._eventObject = {
            handleEvent: this._callbackSubmitForm,
            buttonSubmit: this._buttonSubmit,
            formElement: this._formElement,
        };
    }

    addEventSubmitForForm() {

        if(this._selectorPopup.id === 'confirmDelete') {
            this._buttonSubmit.addEventListener('click', this._eventObject);
        } else {
            this._formElement.addEventListener('submit', this._eventObject);
        }
    }

    _removeFormListener() {
        if(this._selectorPopup.id === 'confirmDelete') {
            this._buttonSubmit.removeEventListener('click', this._eventObject);
        } else {
            this._formElement.removeEventListener('submit', this._eventObject);
        }
        
    }

    _fillInitialValuesFields() {
        this._formElement.elements.name.value = userName.textContent;
        this._formElement.elements.description.value = userAbout.textContent;
    }

    changeButtonTextDuringLoading({loadingText, primaryText}) {
        if(loadingText) {
            this._primaryTextButton = primaryText;
            this._buttonSubmit.textContent = loadingText;
        } else {
            this._buttonSubmit.textContent = this._primaryTextButton;
        }
    }

    closePopup() {
        this._removeFormListener(); 
        super.closePopup();
    }

    openPopup({withInitialValuesFields, cardObject, reset}) {
        this._eventObject.cardObject = cardObject;
        this._eventObject.obj = this;

        if(withInitialValuesFields === true) {
            this._fillInitialValuesFields();
        }
        if(reset) {
            this._formElement.reset();
        }
        this.addEventSubmitForForm();
        super.openPopup();
    }
}

class PopupWithImage extends Popup {
    constructor({selectorPopup}) {
        super({selectorPopup: selectorPopup});
        this.card = null;
        this._elementImageOfPopupImage = this._selectorPopup.querySelector('.popup__image');
        this._elementCaptionOfPopupImage = this._selectorPopup.querySelector('.popup__image-caption');
    }


    openPopup() {
        this._elementImageOfPopupImage.src = this.card.cardImg.src; 
        this._elementImageOfPopupImage.alt = this.card.cardImg.alt;  
        this._elementCaptionOfPopupImage.textContent = this.card.cardName.textContent; 
        super.openPopup();
    }

}

class Section {
    constructor({items, renderer}, container) {
        this._data = items;
        this._renderer = renderer;
        this._container = container;
    }


    addItem({element}) {
        this._container.prepend(element.cardItem);
        
    }

    appendCardOnPage() { 
        this._data.forEach(card => {
            this._renderer(card)
                .then(res => { 
                    this.addItem({element: res});
                })
                .catch(err => {
                    console.log(`Ошибка отрисовки карточки. ${err}`);
                })
        });
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
    Section,
    PopupWithImage,
    PopupWithForm,
    Popup,
};