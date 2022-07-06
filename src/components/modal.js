import {popupImage} from './utils.js';


const ElementImageOfPopupImage = popupImage.querySelector('.popup__image');
const ElementCaptionOfPopupImage = popupImage.querySelector('.popup__image-caption');
export const profileName = document.querySelector('.profile-section__name');
export const profileDescription = document.querySelector('.profile-section__text');


function addEventForCloseButton(settings={popup: null, removeListener: false}) {
    const buttonClose = settings.popup.querySelector('.popup__close');
    const handlerEventObject = {
        handleEvent: closePopupToButton, 
        popup: settings.popup
    }
    if(settings.removeListener) {
        buttonClose.removeEventListener('click', handlerEventObject);
    } else {
        buttonClose.addEventListener('click', handlerEventObject);
    }
}

function closePopupToButton(evt) {
    closePopup({popup: this.popup});
}

function addEventToOverlayForClose(settings={popup: null, removeListener: false}) {
    if(settings.removeListener) {
        settings.popup.removeEventListener('click', closePopupToOverlay);
    } else {
        settings.popup.addEventListener('click', closePopupToOverlay);
    }
}

function closePopupToOverlay(evt) {
    if (!(evt.target.closest('.popup__container'))) {
        closePopup({popup: evt.currentTarget});
    }
}


function addEventToKeyForClose(settings={removeListener: false}) {
    if(settings.removeListener) {
        document.removeEventListener('keydown', closePopupToKey);
    } else {
        document.addEventListener('keydown', closePopupToKey);
    }
        
}

function closePopupToKey(evt) {
    if (evt.key === 'Escape') {
        const popup = document.querySelector('.popup_opened');
        if(popup) {
            closePopup({popup: popup});
        }
    }
}


function closePopup(settings={popup: null, handleEvent: null}) {
    const form = settings.popup.querySelector('.form');
    settings.popup.classList.remove('popup_opened');
    addEventForClosePopup({popup: settings.popup, removeListeners: true});
    if(form) {
        removeFormListener({formElement: form, handlers: settings.handleEvent}); 
    } 
}

function removeFormListener(settings={formElement: null, handlers: null}) {
    settings.formElement.removeEventListener('submit', settings.handlers);
}

function addEventForClosePopup(settings={popup: null, removeListeners: false}) {
    if(settings.removeListeners) {
        addEventForCloseButton({popup: settings.popup, removeListener: true});
        addEventToOverlayForClose({popup: settings.popup, removeListener: true});
        addEventToKeyForClose({removeListener: true});
    } else {
        addEventForCloseButton({popup: settings.popup});
        addEventToOverlayForClose({popup: settings.popup});
        addEventToKeyForClose();
    }
        
}



function addEventOpenImagePopup(typeEvent, popup, cardImg, cardName) {
    cardImg.addEventListener(typeEvent, () => {
        openPopup({
            popup: popup, 
            options: {
                justOpen: true,
            }});
        addEventForClosePopup({popup: popup});
        ElementImageOfPopupImage.src = cardImg.src;
        ElementImageOfPopupImage.alt = cardImg.alt;
        ElementCaptionOfPopupImage.textContent = cardName.textContent;
    });
}



function openPopup(settings={popup: null, }) {
    settings.popup.classList.add('popup_opened');
}

function addEventSubmitForForm(settings={
    popup: null,
    formElement: null,
    buttonSubmit: null, 
    handlers: null, 
    cardElement: null, 
    cardObject: null,
    removeListener: false,
}) {
        if(settings.popup.id === 'confirmDelete') {
            settings.buttonSubmit.addEventListener('click', {
                handleEvent: settings.handlers,
                cardElement: settings.cardElement, 
                cardObject: settings.cardObject,
                popup: settings.popup,
                buttonSubmit: settings.buttonSubmit,
            });
        } else {
            settings.formElement.addEventListener('submit', {
                handleEvent: settings.handlers,
                popup: settings.popup,
                buttonSubmit: settings.buttonSubmit,
                formElement: settings.formElement,
            });
        }
    }




function fillInitialValuesFields(formElement) {
    formElement.elements.name.value = profileName.textContent;
    formElement.elements.description.value = profileDescription.textContent;
}





export {
    addEventOpenImagePopup, 
    openPopup,
    closePopup,
    addEventSubmitForForm,
    addEventForClosePopup,
    fillInitialValuesFields,
};