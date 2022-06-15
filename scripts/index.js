const addCard = document.querySelector('#addCard');
const formAddCard = addCard.querySelector('#formAddCard');
const inputSourceImg = addCard.querySelectorAll('.form__input-text')[1];
const inputNameCard = addCard.querySelectorAll('.form__input-text')[0];
const closeButtonAddCard = addCard.querySelector('.popup__close');
const buttonAdd = document.querySelector('.profile-section__add');

const editProfile = document.querySelector('#editProfile');
const formEditProfile = document.querySelector('#formEditPofile');
const inputNameOfEditProfile = editProfile.querySelectorAll('.form__input-text')[0];
const inputTextOfEditProfile = editProfile.querySelectorAll('.form__input-text')[1];
const closeButtonEditCard = editProfile.querySelector('.popup__close');
const buttonEdit = document.querySelector('.profile-section__edit');

const profileName = document.querySelector('.profile-section__name');
const profileText = document.querySelector('.profile-section__text');
const openImage = document.querySelector('#openImage');
const closeButtonOpenImage = openImage.querySelector('.popup__close');

const popupImage = openImage.querySelector('.popup__image');
const popupImageCaption = openImage.querySelector('.popup__image-caption');
const cardItemsList = document.querySelector('.photo-grid__items');


function addEventForCloseButton(button, popup) {
    button.addEventListener('click', () => closePopup(popup))
}

function addEventOpenImagePopup(typeEvent, cardImg, cardName) {
    cardImg.addEventListener(typeEvent, () => {
        openPopup(openImage);
        popupImage.src = cardImg.src;
        popupImage.alt = cardImg.alt;
        popupImageCaption.textContent = cardName.textContent;
    });
}

function openPopupForAdd() {
    openPopup(addCard);
    formAddCard.reset();
}

function openPopupForEdit() {
    openPopup(editProfile);
    inputNameOfEditProfile.value = profileName.textContent;
    inputTextOfEditProfile.value = profileText.textContent;
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


function addEventLikeButton(typeEvent, cardObj, className) {
        cardObj.likeButton.addEventListener(typeEvent, function() {
            cardObj.likeButton.classList.toggle(className);
        });
}


function addEventButtonDelete(typeEvent, cardObj, parentClassName) {

        cardObj.buttonDelete.addEventListener(typeEvent, function(evt) {
            const currentButtonDelete = evt.target;
            const cardElement = currentButtonDelete.closest(parentClassName);
            cardElement.remove();
        });
}

function getCardObject(initialData, params = {
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

    cardObject.cardImg.src = initialData.link;
    cardObject.cardImg.alt = initialData.name;
    cardObject.cardName.textContent = initialData.name;

    addEventLikeButton('click', cardObject, 'photo-grid__like-icon_active');
    addEventButtonDelete('click', cardObject, '.photo-grid__element-container')
    addEventOpenImagePopup('click', cardObject.cardImg, cardObject.cardName);   
    return cardObject;
}

function insertCardInsideList (card) {
    cardItemsList.prepend(card.cardItem);
}


function addCardOnPage(evt) {
    evt.preventDefault();
    const cardObject = getCardObject(
        {
        link: inputSourceImg.value, 
        name: inputNameCard.value
        });
    insertCardInsideList(cardObject);
    closePopup(addCard);
}


function handleProfileEditFormSubmit(evt) {
    evt.preventDefault();
    profileName.textContent = inputNameOfEditProfile.value;
    profileText.textContent = inputTextOfEditProfile.value;
    closePopup(editProfile);
}



function addEventToOverlayForClose(popup, classNamePopupContainer) {
    popup.addEventListener('click', evt => {
        if (!(evt.target.closest(classNamePopupContainer))) {
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

function addEventForClosePopup(button, popup) {
    addEventForCloseButton(button, popup);
    addEventToOverlayForClose(popup, '.popup__container');
    addEventToKeyForClose(popup);
}



addEventForClosePopup(closeButtonOpenImage, openImage);
addEventForClosePopup(closeButtonAddCard, addCard);
addEventForClosePopup(closeButtonEditCard, editProfile);

initialCards.forEach(function(item) {
    const cardObject = getCardObject(item);
    insertCardInsideList(cardObject);
});

formAddCard.addEventListener('submit', addCardOnPage);
formEditProfile.addEventListener('submit', handleProfileEditFormSubmit);
buttonAdd.addEventListener('click', openPopupForAdd);
buttonEdit.addEventListener('click', openPopupForEdit);







