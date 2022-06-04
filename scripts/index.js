const addCard = document.querySelector('#addCard');
const inputSourceImg = addCard.querySelectorAll('.form__input-text')[1];
const inputNameCard = addCard.querySelectorAll('.form__input-text')[0];

const editProfile = document.querySelector('#editProfile');
const inputNameOfEditProfile = editProfile.querySelectorAll('.form__input-text')[0];
const inputTextOfEditProfile = editProfile.querySelectorAll('.form__input-text')[1];

const profileName = document.querySelector('.profile-section__name');
const profileText = document.querySelector('.profile-section__text');
const openImage = document.querySelector('#openImage');
const popupImage = openImage.querySelector('.popup__image');
const popupImageCaption = openImage.querySelector('.popup__image-caption');
const cardItemsList = document.querySelector('.photo-grid__items');


function addEventOpenImagePopup(typeEvent, cardImg, cardName) {
    cardImg.addEventListener(typeEvent, () => {

        openPopup(openImage);

        popupImage.src = cardImg.src;
        popupImage.alt = cardImg.alt;

        popupImageCaption.textContent = cardName.textContent;
        
    });
}


function getCloneNode(template, desiredNode) {
    const photoGridItemTemplate = document.querySelector(template).content;
    
    return photoGridItemTemplate.querySelector(desiredNode).cloneNode(true);
}


function closePopup(popup) {
    popup.classList.remove('popup_opened');
}

function openPopup(popup) {
    popup.classList.add('popup_opened');
}


function addEventLikeButton(typeEvent, buttonElement, cardObj, className) {
    
    if(buttonElement) {
        buttonElement.addEventListener(typeEvent, function() {
            buttonElement.classList.toggle(className);
        });
    }
    
    if(cardObj) {
        cardObj.likeButton.addEventListener(typeEvent, function() {
            cardObj.likeButton.classList.toggle(className);
        });
    }
}


function addEventButtonDelete(typeEvent, buttonElement, cardObj, parentClassName) {
    
    if(buttonElement) {
        buttonElement.addEventListener(typeEvent, function(evt) {
            const currentButtonDelete = evt.target;
            const cardElement = currentButtonDelete.closest(parentClassName);
    
            cardElement.remove();
        });
    }
    
    if(cardObj) {
        cardObj.buttonDelete.addEventListener(typeEvent, function(evt) {
            const currentButtonDelete = evt.target;
            const cardElement = currentButtonDelete.closest(parentClassName);
    
            cardElement.remove();
        });
    }
}

function getCardObject(initialData=undefined, params = {
    template: '#photo-grid__item', 
    node:'.photo-grid__element-container', 
    classOfImage:'.photo-grid__image', 
    classOfName:'.photo-grid__name', 
    classOfLike:'.photo-grid__like-icon', 
    classOfDelete:'.photo-grid__delete', 
    }) {

    const cardItem = getCloneNode(params.template, params.node);
    const cardImg = cardItem.querySelector(params.classOfImage);
    const cardName = cardItem.querySelector(params.classOfName);
    const likeButton = cardItem.querySelector(params.classOfLike);
    const buttonDelete = cardItem.querySelector(params.classOfDelete);
    const cardObject = {
        cardItem, 
        cardImg,
        cardName,
        likeButton,
        buttonDelete,
    } 

    if(initialData) {
        cardObject.cardImg.src = initialData.link;
        cardObject.cardImg.alt = initialData.name;
        cardObject.cardName.textContent = initialData.name;
    }

    addEventLikeButton('click', false, cardObject, 'photo-grid__like-icon_active');

    addEventButtonDelete('click', false, cardObject, '.photo-grid__element-container')

    addEventOpenImagePopup('click', cardObject.cardImg, cardObject.cardName);

    cardItemsList.prepend(cardObject.cardItem);

    return cardObject;
}


function addCardOnPage(evt) {
    evt.preventDefault();

    getCardObject({
        link: inputSourceImg.value, 
        name: inputNameCard.value
    });

    closePopup(addCard);
}


function handleProfileEditFormSubmit(evt) {
    evt.preventDefault();

    profileName.textContent = inputNameOfEditProfile.value;
    profileText.textContent = inputTextOfEditProfile.value;

    closePopup(editProfile);
}




initialCards.forEach(function(item) {

    getCardObject(item);
    
});

addCard.addEventListener('submit', addCardOnPage);
editProfile.addEventListener('submit', handleProfileEditFormSubmit);
document.querySelectorAll('.popup__close').forEach(popupCloseButton => popupCloseButton.addEventListener('click', closePopup));
document.querySelector('.profile-section__add').addEventListener('click', function() {
    
    openPopup(addCard);

    addCard.querySelector('#formAddCard').reset();

});
document.querySelector('.profile-section__edit').addEventListener('click', function () {

    openPopup(editProfile);

    inputNameOfEditProfile.value = profileName.textContent;
    inputTextOfEditProfile.value = profileText.textContent;

});







