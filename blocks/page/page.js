function addEventOpenImagePopup(typeEvent, cardImg, cardName) {
    cardImg.addEventListener(typeEvent, () => {
        const openImage = document.querySelector('#openImage');
        const image = openImage.querySelector('.popup__image');
        const caption = openImage.querySelector('.popup__image-caption');

        openImage.classList.add('popup_opened');

        image.src = cardImg.src;
        image.alt = cardImg.alt;

        caption.textContent = cardName.textContent;
        
    });
}


function getCloneNode(template, desiredNode) {
    let photoGridItemTemplate = document.querySelector(template).content;
    
    return photoGridItemTemplate.querySelector(desiredNode).cloneNode(true);
}


function popupClose() {
    document.querySelectorAll('.popup').forEach(popup => popup.classList.remove('popup_opened'));
}


function addEventLikeButton(typeEvent, buttonElement, className) {
    buttonElement.addEventListener(typeEvent, function() {
        buttonElement.classList.toggle(className);
    });
}


function addEventButtonDelete(typeEvent, buttonElement, parentClassName) {
    buttonElement.addEventListener(typeEvent, function(evt) {
        const currentButtonDelete = evt.target;
        const cardElement = currentButtonDelete.closest(parentClassName);

        cardElement.remove();
    });
}

// photo-grid__items -------------------------------------------------------------------------------------------------------

const initialCards = [
    {
      name: 'Архыз',
      link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/arkhyz.jpg'
    },
    {
      name: 'Челябинская область',
      link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/chelyabinsk-oblast.jpg'
    },
    {
      name: 'Иваново',
      link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/ivanovo.jpg'
    },
    {
      name: 'Камчатка',
      link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kamchatka.jpg'
    },
    {
      name: 'Холмогорский район',
      link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kholmogorsky-rayon.jpg'
    },
    {
      name: 'Байкал',
      link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/baikal.jpg'
    }
    ];

    const cardImg = cardItem.querySelector('.photo-grid__image');
    const cardName = cardItem.querySelector('.photo-grid__name');
    const likeButton = cardItem.querySelector('.photo-grid__like-icon');
    const buttonDelete = cardItem.querySelector('.photo-grid__delete');
    const cardItemsList = document.querySelector('.photo-grid__items');

initialCards.forEach(function(item) {

    let cardItem = getCloneNode('#photo-grid__item', '.photo-grid__element-container');

    cardImg.src = item.link;
    cardImg.alt = item.name;

    cardName.textContent = item.name;

    addEventLikeButton('click', likeButton, 'photo-grid__like-icon_active');

    addEventButtonDelete('click', buttonDelete, '.photo-grid__element-container')

    addEventOpenImagePopup('click', cardImg, cardName);

    cardItemsList.prepend(cardItem);
});

document.querySelectorAll('.popup__close').forEach(popupCloseButton => popupCloseButton.addEventListener('click', popupClose));


//profile-section__add ------------------------------------------------------------------------------------------------

const addCard = document.querySelector('#addCard');


document.querySelector('.profile-section__add').addEventListener('click', function() {
    
    addCard.classList.add('popup_opened');

    addCard.querySelectorAll('.form__input-text').forEach(input => input.value = '');


});

addCard.addEventListener('submit', function(evt) {
    evt.preventDefault();

    let cardItem = getCloneNode('#photo-grid__item', '.photo-grid__element-container');

    let inputSourceImg = addCard.querySelectorAll('.form__input-text')[1];
    let inputNameCard = addCard.querySelectorAll('.form__input-text')[0];


    cardImg.src = inputSourceImg.value;
    cardImg.alt = inputNameCard.value;

    cardName.textContent = inputNameCard.value;
    
    addEventOpenImagePopup('click', cardImg, cardName);

    addEventLikeButton('click', likeButton, 'photo-grid__like-icon_active');

    addEventButtonDelete('click', buttonDelete, '.photo-grid__element-container')

    cardItemsList.prepend(cardItem);

    popupClose();
    
});


//profile-section__edit -------------------------------------------------------------------------------------------------

const editProfile = document.querySelector('#editProfile');

document.querySelector('.profile-section__edit').addEventListener('click', function () {

    editProfile.classList.add('popup_opened');

    for (let input of editProfile.querySelectorAll('.form__input-text')) {
        if (input.getAttribute('name') === 'name') {
            input.value = document.querySelector('.profile-section__name').textContent;
        } else if (input.getAttribute('name') === 'description') {
            input.value = document.querySelector('.profile-section__text').textContent;
        }
    }

});


function formSaveHandler(evt) {
    evt.preventDefault();

    let userName = document.querySelector('.profile-section__name');
    let userDescription = document.querySelector('.profile-section__text');

    for (let input of editProfile.querySelectorAll('.form__input-text')) {
        if (input.getAttribute('name') === 'name') {
            userName.textContent = input.value;
        } else if (input.getAttribute('name') === 'description') {
            userDescription.textContent = input.value;
        }
    }

    popupClose();
}

editProfile.addEventListener('submit', formSaveHandler);



