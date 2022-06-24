import {getArrayInputsOfForm} from './utils.js';
import {validationSettings} from '../index.js';

function addEventForCloseButton(popup) {
    const buttonClose = popup.querySelector('.popup__close');
    buttonClose.addEventListener('click', () => closePopup(popup))
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


function closePopup(popup) {
    popup.classList.remove('popup_opened');
}


function openPopup(popup, formElement=null, settings={needReset: false, fillInitialValuesFields:[]}) {
    popup.classList.add('popup_opened');
    if(settings.needReset) {
        formElement.reset();
    }
    if(settings.fillInitialValuesFields) {
        fillInitialValuesFields(popup, settings.fillInitialValuesFields, validationSettings);
    }
}

function addEventToOverlayForClose(popup) {
    popup.addEventListener('click', evt => {
        if (!(evt.target.closest('.popup__container'))) {
            closePopup(popup);
        }
    });
}

function closePopupToKey(evt, popup) {
    if (evt.key === 'Escape' && popup.classList.contains('popup_opened')) {
        closePopup(popup);
    }
}

function addEventToKeyForClose(popup) {
    document.addEventListener('keydown', evt => {
        closePopupToKey(evt, popup);
    });
}

function addEventForClosePopup(popup) {
    addEventForCloseButton(popup);
    addEventToOverlayForClose(popup);
    addEventToKeyForClose(popup);
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
                arrayData.textContent[i] = popupInputs[i].value;
            }
        }
        
}


function handleProfileEditFormSubmit(evt, popup, profileName, profileText) {
    evt.preventDefault();
    fillInitialValuesFields(popup, [profileName, profileText], null, true);
    closePopup(popup);
}

function handleEditAvatarFormSubmit(evt, popup) {
    evt.preventDefault();
    const profileAvatar = document.querySelector('.profile-section__avatar');
    const inputLinkToAvatar = popup.querySelector('.form__input-text');
    profileAvatar.src = inputLinkToAvatar.value;
    closePopup(popup);
}

export {
    addEventOpenImagePopup, 
    handleProfileEditFormSubmit, 
    handleEditAvatarFormSubmit,
    addEventForClosePopup, 
    openPopup,
};