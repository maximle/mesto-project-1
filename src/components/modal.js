import {updateProfileInformation, config} from './api.js';


function addEventForCloseButton(popup, settings={removeEvent: false}) {
    const buttonClose = popup.querySelector('.popup__close');
    if(settings.removeEvent) {
        buttonClose.removeEventListener('click', closePopup);
    } else {
        buttonClose.addEventListener('click', closePopup);
    }
}

function addEventOpenImagePopup(typeEvent, popup, cardImg, cardName) {
    const imageOfPopup = popup.querySelector('.popup__image');
    const captionImageOfPopup = popup.querySelector('.popup__image-caption');
    cardImg.addEventListener(typeEvent, () => {
        openPopup(popup);
        imageOfPopup.src = cardImg.src;
        imageOfPopup.alt = cardImg.alt;
        captionImageOfPopup.textContent = cardName.textContent;
    });
}


function closePopup(evt=null, popup=null) {
    if(popup) {
        addEventForClosePopup(popup, {removeAllCloseEvent: true});
        popup.classList.remove('popup_opened');
    } else {
        const popup = evt.target.closest('.popup');
        addEventForClosePopup(popup, {removeAllCloseEvent: true});
        popup.classList.remove('popup_opened');
    }
    
}


function openPopup(popup, formElement=null, settings={needReset: false, fillInitialValuesFields: null}) {
    popup.classList.add('popup_opened');
    if(settings.needReset) {
        formElement.reset();
    }
    if(settings.fillInitialValuesFields) {
        fillInitialValuesFields(popup, settings.fillInitialValuesFields);
    }
    addEventForClosePopup(popup);
}

function addEventToOverlayForClose(popup, settings={removeEvent: false}) {
    if(settings.removeEvent) {
        popup.removeEventListener('click', closePopupToOverlay);
    } else {
        popup.addEventListener('click', closePopupToOverlay);
    }
}

function closePopupToOverlay(evt) {
    if (!(evt.target.closest('.popup__container'))) {
        closePopup(evt);
    }
}


function closePopupToKey(evt) {
    if (evt.key === 'Escape') {
        const popup = document.querySelector('.popup_opened');
        if(popup) {
            closePopup(null, popup);
        } else {
            console.log('Открытых попапов нет.');
        }
    }
}

function addEventToKeyForClose(settings={removeEvent: false}) {
    if(settings.removeEvent) {
        document.removeEventListener('keydown', closePopupToKey);
    } else {
        document.addEventListener('keydown', closePopupToKey);
    }
}

function addEventForClosePopup(popup, settings={removeAllCloseEvent: false}) {
    if(settings.removeAllCloseEvent) {
        addEventForCloseButton(popup, {removeEvent: true});
        addEventToOverlayForClose(popup, {removeEvent: true});
        addEventToKeyForClose({removeEvent: true});
    } else {
        addEventForCloseButton(popup);
        addEventToOverlayForClose(popup);
        addEventToKeyForClose();
    }
}


function fillInitialValuesFields(popup, arrayData=[], reverse=false) {
    const form = popup.querySelector('.form');
        if(!reverse) {
            form.elements.name.value = arrayData[0].textContent;
            form.elements.description.value = arrayData[1].textContent;
        } else {
            arrayData[0].textContent = form.elements.name.value;
            arrayData[1].textContent = form.elements.description.value;
            updateProfileInformation({
                information: {
                    name: form.elements.name.value,
                    description: form.elements.description.value,
                }
            })
        }
        
}



function handleProfileEditFormSubmit(evt, popup, profileName, profileText, validationSettings=null) {
    evt.preventDefault();
    fillInitialValuesFields(popup, [profileName, profileText], true);
    closePopup(evt);
}

function handleEditAvatarFormSubmit(evt, popup) {
    evt.preventDefault();
    const profileAvatar = document.querySelector('.profile-section__avatar');
    const inputLinkToAvatar = popup.querySelector('.form__input-text');
    profileAvatar.src = inputLinkToAvatar.value;
    closePopup(evt);
}

export {
    addEventOpenImagePopup, 
    handleProfileEditFormSubmit, 
    handleEditAvatarFormSubmit,
    openPopup,
    closePopup,
};