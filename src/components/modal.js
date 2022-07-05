import {updateProfileInformation, updateAvatar} from './api.js';
import {formsAndHandlers, userObject} from './utils.js';
import { checkValidityOfFields, toggleButtonSubmitState } from './validate.js';


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
    closePopup(this.popup);
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
        closePopup(evt.currentTarget);
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
            closePopup(popup);
        }
    }
}


function closePopup(popup) {
    const form = popup.querySelector('.form');
    popup.classList.remove('popup_opened');
    addEventForClosePopup({popup: popup, removeListeners: true});
    if(form) {
        removeFormListener({formElement: form, formsAndHandlers: formsAndHandlers}); 
    } 
}

function removeFormListener(settings={formElement: null, formsAndHandlers: null}) {
    settings.formElement.removeEventListener('submit', settings.formsAndHandlers[settings.formElement.id]);
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
    const imageOfPopup = popup.querySelector('.popup__image');
    const captionImageOfPopup = popup.querySelector('.popup__image-caption');
    cardImg.addEventListener(typeEvent, () => {
        openPopup({
            popup: popup, 
            options: {
                justOpen: true,
            }});
        imageOfPopup.src = cardImg.src;
        imageOfPopup.alt = cardImg.alt;
        captionImageOfPopup.textContent = cardName.textContent;
    });
}





function openPopup(settings={
    popup: null, 
    formElement: null, 
    cardElement: null, 
    cardObject: null, 
    options: {
        validationSettings: null,
        needReset: false, 
        justOpen: null,
    }}) {
    settings.popup.classList.add('popup_opened');
    addEventForClosePopup({popup: settings.popup});
    if(!(settings.options && settings.options.justOpen)) {
        if(settings.options && settings.options.needReset) {
            settings.formElement.reset();
        }
        if(settings.formElement.id === 'formEditPofile') {
            fillInitialValuesFields(settings.formElement);
        }
        addEventSubmitForForm({
            popup: settings.popup,
            formElement: settings.formElement, 
            formsAndHandlers: formsAndHandlers, 
            cardElement: settings.cardElement, 
            cardObject: settings.cardObject,
        })
        if(settings.options && settings.options.validationSettings) {
            checkValidityOfFields(settings.formElement, settings.options.validationSettings);
            toggleButtonSubmitState(settings.formElement, settings.options.validationSettings);
        }
    }
}

function addEventSubmitForForm(settings={
    popup: null,
    formElement: null, 
    formsAndHandlers: null, 
    cardElement: null, 
    cardObject: null,
    removeListener: false,
}) {
    if(settings.formElement.id in settings.formsAndHandlers) {
        if(settings.formElement.id === 'formConfirmDelete') {
            settings.formElement.addEventListener('submit', {
                handleEvent: settings.formsAndHandlers[settings.formElement.id],
                cardElement: settings.cardElement, 
                cardObject: settings.cardObject,
                popup: settings.popup,
            });
        } else {
            settings.formElement.addEventListener('submit', settings.formsAndHandlers[settings.formElement.id]);
        }
    }
}




function fillInitialValuesFields(formElement, reverse=false) {
    const profileName = document.querySelector('.profile-section__name');
    const profileDescription = document.querySelector('.profile-section__text');
        if(!reverse) {
            formElement.elements.name.value = profileName.textContent;
            formElement.elements.description.value = profileDescription.textContent;
        } else {
            updateProfileInformation({
                information: {
                    name: formElement.elements.name.value,
                    description: formElement.elements.description.value,
                }
            })
                .then(updatedUser => {
                    if(updatedUser) {
                        profileName.textContent = updatedUser.name;
                        profileDescription.textContent = updatedUser.about;

                        userObject.name = updatedUser.name;
                        userObject.description = updatedUser.about;
                        userObject.avatar = updatedUser.avatar;
                        userObject['_id'] = updatedUser['_id'];
                    }
                })
            
        }
        
}



function handleProfileEditFormSubmit(evt) {
    evt.preventDefault();
    const popup = evt.currentTarget.closest('.popup');
    const btn = evt.target.querySelector('.form__save');
    const btnPrimaryValue = btn.textContent;
    btn.textContent = 'Сохранение...';

    setTimeout(() => {   // DOM не успевает перерисоваться              

        fillInitialValuesFields(evt.target, true);
        closePopup(popup);
        btn.textContent = btnPrimaryValue;
    }, 1);
    
}

function handleEditAvatarFormSubmit(evt) {
    evt.preventDefault();
    const popup = evt.target.closest('.popup');
    const profileAvatar = document.querySelector('.profile-section__avatar');
    const inputLinkToAvatar = popup.querySelector('.form__input-text');

    const btn = evt.target.querySelector('.form__save');
    const btnPrimaryValue = btn.textContent;
    btn.textContent = 'Сохранение...';

    setTimeout(() => {   // DOM не успевает перерисоваться  
        
        updateAvatar({link: inputLinkToAvatar.value})
        .then(userAvatar => {
            if(userAvatar) {
                profileAvatar.src = userAvatar.avatar;
            }
        })
        closePopup(popup);
        btn.textContent = btnPrimaryValue;
    }, 1);
    
}

export {
    addEventOpenImagePopup, 
    handleProfileEditFormSubmit, 
    handleEditAvatarFormSubmit,
    openPopup,
    closePopup,
};