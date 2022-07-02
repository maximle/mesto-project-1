import {addEventOpenImagePopup, closePopup} from './modal.js';
import {getCloneNode, cardItemsList, checkLoadImageFromServer, popupImage} from './utils.js';
import {addCardOnServer} from './api.js';

function insertCardInsideList (card, container) {
    container.prepend(card.cardItem);
}

function getCardObject(initialData, params = {
    template: '#photo-grid__item', 
    node:'.photo-grid__element-container', 
    classOfImage:'.photo-grid__image', 
    classOfName:'.photo-grid__name', 
    classOfLike:'.photo-grid__like-icon', 
    classOfDelete:'.photo-grid__delete',
    classOfLikes: '.photo-grid__likes', 
    }) {

    const cardItem = getCloneNode(params.template, params.node);
    const cardImg = cardItem.querySelector(params.classOfImage);
    const cardName = cardItem.querySelector(params.classOfName);
    const likeButton = cardItem.querySelector(params.classOfLike);
    const buttonDelete = cardItem.querySelector(params.classOfDelete);
    const quantityLikes = cardItem.querySelector(params.classOfLikes);
    const cardObject = {
        cardItem: cardItem, 
        cardImg: cardImg,
        cardName: cardName,
        likeButton: likeButton,
        buttonDelete: buttonDelete,
        likes: quantityLikes,
    } 
 

    cardObject.cardImg.src = initialData.link;
    cardObject.cardImg.alt = initialData.name;
    cardObject.cardName.textContent = initialData.name;
    cardObject.likes.textContent = initialData.likes.length;


    addEventLikeButton('click', cardObject, 'photo-grid__like-icon_active');
    addEventButtonDelete('click', cardObject, '.photo-grid__element-container')
    addEventOpenImagePopup('click', popupImage, cardObject.cardImg, cardObject.cardName);   
    return cardObject;
}


function addCardOnPage(evt, popup) {
    evt.preventDefault();
    const inputSourceImg = popup.querySelectorAll('.form__input-text')[1];
    const inputNameCard = popup.querySelectorAll('.form__input-text')[0];
    const cardObject = getCardObject(
        {
        link: inputSourceImg.value, 
        name: inputNameCard.value
        });
    insertCardInsideList(cardObject, cardItemsList);
    addCardOnServer({information: {name: cardObject.cardName, link: cardObject.cardImg.src}});
    closePopup(evt);
}

function addEventButtonDelete(typeEvent, cardObj, parentClassName) {

    cardObj.buttonDelete.addEventListener(typeEvent, function(evt) {
        const currentButtonDelete = evt.target;
        const cardElement = currentButtonDelete.closest(parentClassName);
        cardElement.remove();
    });
}

function addEventLikeButton(typeEvent, cardObj, className) {
    cardObj.likeButton.addEventListener(typeEvent, function() {
        cardObj.likeButton.classList.toggle(className);
    });
}

function initialCards(data) {
    data
        .then(arrayCards => {
            if(arrayCards) {
                arrayCards.forEach(insertCardOnPage);
            }
        })
}

function insertCardOnPage(card) {
    const cardObject = getCardObject({link: card.link, name: card.name, likes: card.likes});
        checkLoadImageFromServer(cardObject)
            .then(res => {
                insertCardInsideList(res, cardItemsList);
            })
            .catch(err => {
                console.log(`Картинка не загрузилась. ${err.cardImg.src}`);
            }) 
}



export {addCardOnPage, getCardObject, insertCardInsideList, initialCards};