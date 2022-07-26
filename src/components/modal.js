import {popupImage} from './utils.js';


const elementImageOfPopupImage = popupImage.querySelector('.popup__image');
const elementCaptionOfPopupImage = popupImage.querySelector('.popup__image-caption');
const listHandlersEventForClosePopup = {
    closeButtonEvent: {},
    overlayCloseEvent: {},
    toKeyCloseEvent: {},
};
export const userName = document.querySelector('.profile-section__name');
export const userAbout = document.querySelector('.profile-section__text');


function addEventForCloseButton(settings={objectHandler: null}) {
    const buttonClose = settings.objectHandler.popup.querySelector('.popup__close');
    const handlerEventObject = {
        handleEvent: closePopupToButton, 
        objectHandler: settings.objectHandler,
        buttonClose: buttonClose,
    }
    listHandlersEventForClosePopup.closeButtonEvent.buttonClose = buttonClose;
    listHandlersEventForClosePopup.closeButtonEvent.handlerEventObject = handlerEventObject;
    buttonClose.addEventListener('click', handlerEventObject);
}

function closePopupToButton(evt) {
    closePopup({objectHandler: this.objectHandler});
}

function addEventToOverlayForClose(settings={objectHandler: null}) {
    const handlerEventObject = {
        handleEvent: closePopupToOverlay, 
        objectHandler: settings.objectHandler
    };
    listHandlersEventForClosePopup.overlayCloseEvent.popup = settings.objectHandler.popup;
    listHandlersEventForClosePopup.overlayCloseEvent.handlerEventObject = handlerEventObject;
    settings.objectHandler.popup.addEventListener('click', handlerEventObject);
}

function closePopupToOverlay(evt) {
    if (!(evt.target.closest('.popup__container'))) {
        closePopup({objectHandler: this.objectHandler});
    }
}



function addEventToKeyForClose(settings={objectHandler: null}) {
    const handlerEventObject = {
        handleEvent: closePopupToKey, 
        objectHandler: settings.objectHandler
    };
    listHandlersEventForClosePopup.toKeyCloseEvent.handlerEventObject = handlerEventObject;
    document.addEventListener('keydown', handlerEventObject);     
}

function closePopupToKey(evt) {
    if (evt.key === 'Escape') {
        const popup = document.querySelector('.popup_opened');
        if(popup) {
            closePopup({objectHandler: this.objectHandler});
        }
    }
}

function removeEventForCloseButton(settings={listHandlersEventForClosePopup: null}) {
    const buttonCloseEvent = settings.listHandlersEventForClosePopup.closeButtonEvent;
    buttonCloseEvent.buttonClose.removeEventListener('click', buttonCloseEvent.handlerEventObject);
}

function removeEventForCloseToOverlay(settings={listHandlersEventForClosePopup: null}) {
    const overlayCloseEvent = settings.listHandlersEventForClosePopup.overlayCloseEvent;
    overlayCloseEvent.popup.removeEventListener('click', overlayCloseEvent.handlerEventObject);
}

function removeEventForCloseToKey(settings={listHandlersEventForClosePopup: null}) {
    const keyCloseEvent = settings.listHandlersEventForClosePopup.toKeyCloseEvent;
    document.removeEventListener('keydown', keyCloseEvent.handlerEventObject);
}

function closePopup(settings={objectHandler: null}) {
    settings.objectHandler.popup.classList.remove('popup_opened');
    if(settings.objectHandler.formElement) {
        removeFormListener({objectHandler: settings.objectHandler}); 
    }
    removeEventForCloseButton({listHandlersEventForClosePopup: listHandlersEventForClosePopup});
    removeEventForCloseToOverlay({listHandlersEventForClosePopup: listHandlersEventForClosePopup});
    removeEventForCloseToKey({listHandlersEventForClosePopup: listHandlersEventForClosePopup});
}

function removeFormListener(settings={objectHandler: null}) {
    settings.objectHandler.formElement.removeEventListener('submit', settings.objectHandler);
}

function addEventForClosePopup(settings={objectHandler: null}) {
        addEventForCloseButton({objectHandler: settings.objectHandler});
        addEventToOverlayForClose({objectHandler: settings.objectHandler});
        addEventToKeyForClose({objectHandler: settings.objectHandler});
}



function addEventOpenImagePopup(typeEvent, popup, cardImg, cardName) {
    const objectHandler = {
        popup: popup,
    };
    cardImg.addEventListener(typeEvent, () => {
        openPopup({
            popup: objectHandler.popup, 
            options: {
                justOpen: true,
            }});
    addEventForClosePopup({objectHandler: objectHandler});
    elementImageOfPopupImage.src = cardImg.src;
    elementImageOfPopupImage.alt = cardImg.alt;
    elementCaptionOfPopupImage.textContent = cardName.textContent;
    });
}



function openPopup(settings={popup: null, }) {
    settings.popup.classList.add('popup_opened');
}

function addEventSubmitForForm(settings={objectHandler: null}) {
        if(settings.objectHandler.popup.id === 'confirmDelete') {
            settings.objectHandler.buttonSubmit.addEventListener('click', settings.objectHandler);
        } else {
            settings.objectHandler.formElement.addEventListener('submit', settings.objectHandler);
        }
    }




function fillInitialValuesFields(formElement) {
    formElement.elements.name.value = userName.textContent;
    formElement.elements.description.value = userAbout.textContent;
}



export {
    addEventOpenImagePopup, 
    openPopup,
    closePopup,
    addEventSubmitForForm,
    addEventForClosePopup,
    fillInitialValuesFields,
};