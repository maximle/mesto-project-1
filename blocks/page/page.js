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

initialCards.forEach(function(item) {
    let photoGridItemTemplate = document.querySelector('#photo-grid__item').content;
    let cardItem = photoGridItemTemplate.querySelector('.photo-grid__element-container').cloneNode(true);

    const cardImg = cardItem.querySelector('.photo-grid__image');
    cardImg.src = item.link;
    cardImg.alt = item.name;

    const cardName = cardItem.querySelector('.photo-grid__name');
    cardName.textContent = item.name;

    const cardItemsList = document.querySelector('.photo-grid__items');
    cardItemsList.prepend(cardItem);
});


//photo-grid__delete -------------------------------------------------------------------------------------------------

document.querySelectorAll('.photo-grid__delete').forEach(buttonDelete => 
    buttonDelete.addEventListener('click', function(evt) {
        const currentButtonDelete = evt.target;
        const cardElement = currentButtonDelete.closest('.photo-grid__element-container');

        cardElement.remove();
}));

//photo-grid__like-icon ----------------------------------------------------------------------------------------------

document.querySelectorAll('.photo-grid__like-icon').forEach(likeButton => likeButton.addEventListener('click', function() {
    likeButton.classList.toggle('photo-grid__like-icon_active');
}));

//profile-section__add ------------------------------------------------------------------------------------------------

const addCard = document.querySelector('#addCard');


document.querySelector('.profile-section__add').addEventListener('click', function() {
    
    addCard.classList.add('popup_opened');

    addCard.querySelectorAll('.form__input-text').forEach(input => input.value = '');


});

addCard.addEventListener('submit', function(evt) {
    evt.preventDefault();
    
    let photoGridItemTemplate = document.querySelector('#photo-grid__item').content;
    let cardItem = photoGridItemTemplate.querySelector('.photo-grid__element-container').cloneNode(true);   

    const cardImg = cardItem.querySelector('.photo-grid__image');
    cardImg.src = addCard.querySelectorAll('.form__input-text')[1].value;
    cardImg.alt = addCard.querySelectorAll('.form__input-text')[0].value;

    const cardName = cardItem.querySelector('.photo-grid__name');
    cardName.textContent = addCard.querySelectorAll('.form__input-text')[0].value;

    const likeButton = cardItem.querySelector('.photo-grid__like-icon');
    likeButton.addEventListener('click', function() {
        likeButton.classList.toggle('photo-grid__like-icon_active');
    });

    const buttonDelete = cardItem.querySelector('.photo-grid__delete');
    buttonDelete.addEventListener('click', function(evt) {
        const currentButtonDelete = evt.target;
        const cardElement = currentButtonDelete.closest('.photo-grid__element-container');

        cardElement.remove();
    });

    const cardItemsList = document.querySelector('.photo-grid__items');
    cardItemsList.prepend(cardItem);

    popupClose();
    
});

//popup__close -----------------------------------------------------------------------------------------------------------

function popupClose() {

    document.querySelectorAll('.popup').forEach(popup => popup.classList.remove('popup_opened'));
}

document.querySelectorAll('.popup__close').forEach(popupCloseButton => popupCloseButton.addEventListener('click', popupClose));

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

