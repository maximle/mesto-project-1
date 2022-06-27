import {getArrayInputsOfForm, validationSettings} from './utils.js';


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


function openPopup(popup, formElement=null, settings={needReset: false, fillInitialValuesFields:[]}) {
    popup.classList.add('popup_opened');
    if(settings.needReset) {
        formElement.reset();
    }
    if(settings.fillInitialValuesFields) {
        fillInitialValuesFields(popup, settings.fillInitialValuesFields, validationSettings);
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


function fillInitialValuesFields(popup, arrayData=[], validationSettings=null, reverse=false) {
    const popupInputs = getArrayInputsOfForm(popup, validationSettings);
        if(popupInputs.length !== arrayData.length) {
            console.log(`Массивы должны быть равны по длине. 
            Сейчас popupInputs.length(${popupInputs.length} не равен 
                arrayData.length(${arrayData.length})`);
            return false;
        } 
        if(!reverse) {
            for (let i = 0; i < popupInputs.length; i++) {
                popupInputs[i].value = arrayData[i].textContent;
            }
        } else {
            for (let i = 0; i < popupInputs.length; i++) {
                arrayData[i].textContent = popupInputs[i].value;
            }
        }
        
}


function handleProfileEditFormSubmit(evt, popup, profileName, profileText, validationSettings=null) {
    evt.preventDefault();
    fillInitialValuesFields(popup, [profileName, profileText], validationSettings, true);
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