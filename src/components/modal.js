import {popupImage} from './utils.js';


// const elementImageOfPopupImage = popupImage.querySelector('.popup__image');
// const elementCaptionOfPopupImage = popupImage.querySelector('.popup__image-caption');
const listHandlersEventForClosePopup = {
    closeButtonEvent: {},
    overlayCloseEvent: {},
    toKeyCloseEvent: {},
};
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
    }

    addEventSubmitForForm() {
        if(this._selectorPopup.id === 'confirmDelete') {
            this._buttonSubmit.addEventListener('click', this._callbackSubmitForm);
        } else {
            this._formElement.addEventListener('submit', this._callbackSubmitForm);
        }
    }

    _removeFormListener() {
        this._formElement.removeEventListener('submit', this._callbackSubmitForm);
    }

    _fillInitialValuesFields() {
        this._formElement.elements.name.value = userName.textContent;
        this._formElement.elements.description.value = userAbout.textContent;
    }

    closePopup() {
        this._removeFormListener(); 
        super.closePopup();
    }

    openPopup({withInitialValuesFields}) {
        
        if(withInitialValuesFields === true) {
            this._fillInitialValuesFields();
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


// function addEventForCloseButton(settings={objectHandler: null}) {
//     const buttonClose = settings.objectHandler.popup.querySelector('.popup__close');
//     const handlerEventObject = {
//         handleEvent: closePopupToButton, 
//         objectHandler: settings.objectHandler,
//         buttonClose: buttonClose,
//     }
//     listHandlersEventForClosePopup.closeButtonEvent.buttonClose = buttonClose;
//     listHandlersEventForClosePopup.closeButtonEvent.handlerEventObject = handlerEventObject;
//     buttonClose.addEventListener('click', handlerEventObject);
// }

// function closePopupToButton(evt) {
//     closePopup({objectHandler: this.objectHandler});
// }

// function addEventToOverlayForClose(settings={objectHandler: null}) {
//     const handlerEventObject = {
//         handleEvent: closePopupToOverlay, 
//         objectHandler: settings.objectHandler
//     };
//     listHandlersEventForClosePopup.overlayCloseEvent.popup = settings.objectHandler.popup;
//     listHandlersEventForClosePopup.overlayCloseEvent.handlerEventObject = handlerEventObject;
//     settings.objectHandler.popup.addEventListener('click', handlerEventObject);
// }

// function closePopupToOverlay(evt) {
//     if (!(evt.target.closest('.popup__container'))) {
//         closePopup({objectHandler: this.objectHandler});
//     }
// }



// function addEventToKeyForClose(settings={objectHandler: null}) {
//     const handlerEventObject = {
//         handleEvent: closePopupToKey, 
//         objectHandler: settings.objectHandler
//     };
//     listHandlersEventForClosePopup.toKeyCloseEvent.handlerEventObject = handlerEventObject;
//     document.addEventListener('keydown', handlerEventObject);     
// }

// function closePopupToKey(evt) {
//     if (evt.key === 'Escape') {
//         const popup = document.querySelector('.popup_opened');
//         if(popup) {
//             closePopup({objectHandler: this.objectHandler});
//         }
//     }
// }

// function removeEventForCloseButton(settings={listHandlersEventForClosePopup: null}) {
//     const buttonCloseEvent = settings.listHandlersEventForClosePopup.closeButtonEvent;
//     buttonCloseEvent.buttonClose.removeEventListener('click', buttonCloseEvent.handlerEventObject);
// }

// function removeEventForCloseToOverlay(settings={listHandlersEventForClosePopup: null}) {
//     const overlayCloseEvent = settings.listHandlersEventForClosePopup.overlayCloseEvent;
//     overlayCloseEvent.popup.removeEventListener('click', overlayCloseEvent.handlerEventObject);
// }

// function removeEventForCloseToKey(settings={listHandlersEventForClosePopup: null}) {
//     const keyCloseEvent = settings.listHandlersEventForClosePopup.toKeyCloseEvent;
//     document.removeEventListener('keydown', keyCloseEvent.handlerEventObject);
// }

// function closePopup(settings={objectHandler: null}) {
//     settings.objectHandler.popup.classList.remove('popup_opened');
    // if(settings.objectHandler.formElement) {
    //     removeFormListener({objectHandler: settings.objectHandler}); 
    // }
//     removeEventForCloseButton({listHandlersEventForClosePopup: listHandlersEventForClosePopup});
//     removeEventForCloseToOverlay({listHandlersEventForClosePopup: listHandlersEventForClosePopup});
//     removeEventForCloseToKey({listHandlersEventForClosePopup: listHandlersEventForClosePopup});
// }

// function removeFormListener(settings={objectHandler: null}) {
//     settings.objectHandler.formElement.removeEventListener('submit', settings.objectHandler);
// }

// function addEventForClosePopup(settings={objectHandler: null}) {
//         addEventForCloseButton({objectHandler: settings.objectHandler});
//         addEventToOverlayForClose({objectHandler: settings.objectHandler});
//         addEventToKeyForClose({objectHandler: settings.objectHandler});
// }



// function addEventOpenImagePopup(typeEvent, popup, cardImg, cardName) {
//     const objectHandler = {
//         popup: popup,
//     };
//     cardImg.addEventListener(typeEvent, () => {
//         openPopup({
//             popup: objectHandler.popup, 
//             options: {
//                 justOpen: true,
//             }});
//     addEventForClosePopup({objectHandler: objectHandler});
//     elementImageOfPopupImage.src = cardImg.src;
//     elementImageOfPopupImage.alt = cardImg.alt;
//     elementCaptionOfPopupImage.textContent = cardName.textContent;
//     });
// }



// function openPopup(settings={popup: null, }) {
//     settings.popup.classList.add('popup_opened');
// }

// function addEventSubmitForForm(settings={objectHandler: null}) {
//         if(settings.objectHandler.popup.id === 'confirmDelete') {
//             settings.objectHandler.buttonSubmit.addEventListener('click', settings.objectHandler);
//         } else {
//             settings.objectHandler.formElement.addEventListener('submit', settings.objectHandler);
//         }
//     }




// function fillInitialValuesFields(formElement) {
//     formElement.elements.name.value = userName.textContent;
//     formElement.elements.description.value = userAbout.textContent;
// }



export {
    insertCardOnPage,
    Section,
    PopupWithImage,
    PopupWithForm,
    Popup,
};