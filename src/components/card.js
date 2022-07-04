import {addEventOpenImagePopup, closePopup} from './modal.js';
import {
    getCloneNode, 
    cardItemsList, 
    checkLoadImageFromServer, 
    popupImage, 
    userObject, 
    confirmDelete,
} from './utils.js';
import {addCardOnServer, likeCard} from './api.js';

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
        ownerId: '',
        cardId: '',
    } 
 
    
    cardObject.cardImg.src = initialData.link;
    cardObject.cardImg.alt = initialData.name;
    cardObject.cardName.textContent = initialData.name;
    cardObject.likes.textContent = initialData.likes.length;
    cardObject.ownerId = initialData.owner['_id'];
    cardObject.cardId = initialData['_id'];
    
    if(cardObject.ownerId === userObject['_id']) {
        cardObject.buttonDelete.classList.add('photo-grid__delete_active');
        addEventButtonDelete('click', cardObject, '.photo-grid__element-container');
    }

    addEventLikeButton('click', cardObject, 'photo-grid__like-icon_active');
    addEventOpenImagePopup('click', popupImage, cardObject.cardImg, cardObject.cardName);   
    return cardObject;
}


function addCardOnPage(evt) {
    evt.preventDefault();
    const popup = evt.target.closest('.popup');
    const inputSourceImg = popup.querySelectorAll('.form__input-text')[1];
    const inputNameCard = popup.querySelectorAll('.form__input-text')[0];

    const btn = evt.target.querySelector('.form__save');
    const btnPrimaryValue = btn.textContent;
    btn.textContent = 'Сохранение...';

    setTimeout(() => {
        
        addCardOnServer({information: {name: inputNameCard.value, link: inputSourceImg.value}})
        .then(card => {
            if(card) {
                const cardObject = getCardObject(card);
                insertCardInsideList(cardObject, cardItemsList);
            }
        })
    
        closePopup(popup);

        btn.textContent = btnPrimaryValue;
    }, 1);
    
}


function addEventButtonDelete(typeEvent, cardObj, parentClassName) {

    cardObj.buttonDelete.addEventListener(typeEvent, function(evt) {
        const currentButtonDelete = evt.target;
        const cardElement = currentButtonDelete.closest(parentClassName);
        confirmDelete(cardElement, cardObj);
    });
}


function addEventLikeButton(typeEvent, cardObj, className) {
    cardObj.likeButton.addEventListener(typeEvent, function() {
        cardObj.likeButton.classList.toggle(className);
        if(cardObj.likeButton.classList.contains(className)) {
            likeCard({cardObject: cardObj})
                .then(card => {
                    if(card){
                        cardObj.likes.textContent = card.likes.length;
                    }
                })
        } else {
            likeCard({cardObject: cardObj, deleteLike: true})
                .then(card => {
                    if(card){
                        cardObj.likes.textContent = card.likes.length;
                    }
                })
        }
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
    const cardObject = getCardObject(card);
        checkLoadImageFromServer(cardObject)
            .then(res => {
                insertCardInsideList(res, cardItemsList);
            })
            .catch(err => {
                console.log(`Картинка не загрузилась. ${err.cardImg.src}`);
            }) 
}



export {addCardOnPage, getCardObject, insertCardInsideList, initialCards};