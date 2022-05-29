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

    const cardName = cardItem.querySelector('.photo-grid__name');
    cardName.textContent = addCard.querySelectorAll('.form__input-text')[0].value;

    const cardItemsList = document.querySelector('.photo-grid__items');
    cardItemsList.prepend(cardItem);

    popupClose();
    
});



