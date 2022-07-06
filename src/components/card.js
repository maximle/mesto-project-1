import {addEventOpenImagePopup} from './modal.js';
import {
    getCloneNode, 
    cardItemsList, 
    checkLoadImageFromServer, 
    popupImage, 
    userObject, 
    addEventForConfirmDelete,
} from './utils.js';
import {likeCard} from './api.js';

function insertCardInsideList (card, container) {
    container.prepend(card.cardItem);
}

function getCardObject(initialData, userId=null, confirmDeleteCallback=null, params = {
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
        confirmDeleteCallback: confirmDeleteCallback,
    } 
 
    
    cardObject.cardImg.src = initialData.link;
    cardObject.cardImg.alt = initialData.name;
    cardObject.cardName.textContent = initialData.name;
    cardObject.likes.textContent = initialData.likes.length;
    cardObject.ownerId = initialData.owner['_id'];
    cardObject.cardId = initialData['_id'];
    
    if(cardObject.ownerId === userId) {
        cardObject.buttonDelete.classList.add('photo-grid__delete_active');
        addEventButtonDelete('click', cardObject, '.photo-grid__element-container');
    }

    addEventLikeButton(cardObject);
    addEventOpenImagePopup('click', popupImage, cardObject.cardImg, cardObject.cardName);   
    return cardObject;
}





function addEventLikeButton(cardObject) {
    cardObject.likeButton.addEventListener('click', {handleEvent: likeCard, cardObject: cardObject})
}

function removeCard(card) {
    card.remove();
}



function addEventButtonDelete(typeEvent, cardObj, parentClassName) {

    cardObj.buttonDelete.addEventListener(typeEvent, function(evt) {
        const currentButtonDelete = evt.target;
        const cardElement = currentButtonDelete.closest(parentClassName);
        addEventForConfirmDelete(cardElement, cardObj);
    });
}


function changeColorLikeButton(cardObject) {
    cardObject.likeButton.classList.toggle('photo-grid__like-icon_active');
    };

    



function insertCardOnPage(settings={card: null, confirmDeleteCallback: null}) {             
    const cardObject = getCardObject(settings.card, userObject['_id'], settings.confirmDeleteCallback);
        checkLoadImageFromServer(cardObject)                    // Проверяю, могу ли я загрузить картинку, присланную сервером. Если да,
            .then(res => {                                      // 
                insertCardInsideList(res, cardItemsList);       // то отрисовываю на клиенте, если нет, то не рисую. 
            })                                                  // Повторно на сервер не отправляю
            .catch(err => {
                console.log(`Картинка не загрузилась. ${err.cardImg.src}`);
            }) 
}



export {getCardObject, 
    insertCardInsideList, 
    changeColorLikeButton,
    insertCardOnPage,
    removeCard,
};