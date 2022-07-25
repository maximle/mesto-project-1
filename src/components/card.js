
class Card {
    constructor({userId, params, api, popupOpenImage, popupWithForm}) {
        this._initialData = null;
        this._api = api;
        this._popupOpenImage = popupOpenImage;
        this._popupWithForm = popupWithForm;
        this._userId = userId;
        this._params = params;
        this.cardElement = null;
        this._card = {};
    }

    _getCloneNode() {
        const photoGridItemTemplate = document.querySelector(this._params.template).content;
        return photoGridItemTemplate.querySelector(this._params.node).cloneNode(true);
    }

    _makeCardObject() {
        this._card.cardItem = this._getCloneNode();
        this._card.cardImg = this._card.cardItem.querySelector(this._params.classOfImage);
        this._card.cardName = this._card.cardItem.querySelector(this._params.classOfName);
        this._card.likeButton = this._card.cardItem.querySelector(this._params.classOfLike);
        this._card.buttonDelete = this._card.cardItem.querySelector(this._params.classOfDelete);
        this._card.likes = this._card.cardItem.querySelector(this._params.classOfLikes);
        this._card.ownerId = '';
        this._card.cardId = '';

        this._card.cardImg.src = this._initialData.link;
        this._card.cardImg.alt = this._initialData.name;
        this._card.cardName.textContent = this._initialData.name;
        this._card.likes.textContent = this._initialData.likes.length;
        this._card.ownerId = this._initialData.owner['_id'];
        this._card.cardId = this._initialData['_id'];

    }

    // _addEventButtonDelete() {

    //     if(this._card.ownerId === this._userId) {
    //         this._card.buttonDelete.classList.add('photo-grid__delete_active');
    //         this._card.buttonDelete.addEventListener('click', function(evt) {
    //             const currentButtonDelete = evt.target;
    //             this.cardElement = currentButtonDelete.closest(this._params.node);
    //             this._api.setCardObject({cardObject: this})
    //             this._popupWithForm.openPopup();

    //             addEventForConfirmDelete(cardElement, cardObj);       //////////////////////////////////////////////////////
    //         });        
    //     }
    // }

    _addEventButtonDelete() {

        if(this._card.ownerId === this._userId) {
            this.cardElement = this._card.buttonDelete.closest(this._params.node);
            this._card.buttonDelete.classList.add('photo-grid__delete_active');
            this._card.buttonDelete.addEventListener('click', this._popupWithForm.openPopup.bind(this._popupWithForm, {cardObject: this}));        
        }
    }


    _checkMineLike() {
        if(this._initialData.likes.length) {
            for(let i = 0; i < this._initialData.likes.length; i++) {
                if(this._initialData.likes[i]['_id'] === this._userId){
                    this._changeColorLikeButton();
                    break;
                }
            }
        }
    }

    _changeColorLikeButton() {
        this._card.likeButton.classList.toggle('photo-grid__like-icon_active');
    }

    _addEventLikeButton() {
        this._card.likeButton.addEventListener('click', this._likeCard.bind(this));
    }

    _likeCard(evt) {
        const headers = {};
        if(evt.target.classList.contains('photo-grid__like-icon_active')) {
            headers.method = 'DELETE';
        } else {
            headers.method = 'PUT';
        }

        this._api.getDataOnRequestToServer({target: `cards/likes/${this._card.cardId}`, headers: headers})
            .then(card => {
                this._card.likes.textContent = card.likes.length;
                this._changeColorLikeButton();
            })
            .catch(error => {
                console.log(error);
            })
    }

    _addEventOpenImagePopup() {
        this._card.cardImg.addEventListener('click', this._popupOpenImage.openPopup.bind(this._popupOpenImage));
    }

    removeCard() {
        this.cardElement.remove();
    }
    



    getCard({initialData}) {
        this._initialData = initialData;
        this._makeCardObject();
        this._checkMineLike();
        this._addEventButtonDelete();
        this._addEventLikeButton();
        if(this._popupOpenImage) {
            this._popupOpenImage.card = this._card;
            this._addEventOpenImagePopup();
        }
        return this._card;
    }

}

// function insertCardInsideList (card, container) {
//     container.prepend(card.cardItem);
// }

// function getCardObject(initialData, userId=null, confirmDeleteCallback=null, params = {
//     template: '#photo-grid__item', 
//     node:'.photo-grid__element-container', 
//     classOfImage:'.photo-grid__image', 
//     classOfName:'.photo-grid__name', 
//     classOfLike:'.photo-grid__like-icon', 
//     classOfDelete:'.photo-grid__delete',
//     classOfLikes: '.photo-grid__likes', 
//     }) {

//     const cardItem = getCloneNode(params.template, params.node);
//     const cardImg = cardItem.querySelector(params.classOfImage);
//     const cardName = cardItem.querySelector(params.classOfName);
//     const likeButton = cardItem.querySelector(params.classOfLike);
//     const buttonDelete = cardItem.querySelector(params.classOfDelete);
//     const quantityLikes = cardItem.querySelector(params.classOfLikes);
//     const cardObject = {
//         cardItem: cardItem, 
//         cardImg: cardImg,
//         cardName: cardName,
//         likeButton: likeButton,
//         buttonDelete: buttonDelete,
//         likes: quantityLikes,
//         ownerId: '',
//         cardId: '',
//         confirmDeleteCallback: confirmDeleteCallback,
//     } 
 
    
//     cardObject.cardImg.src = initialData.link;
//     cardObject.cardImg.alt = initialData.name;
//     cardObject.cardName.textContent = initialData.name;
//     cardObject.likes.textContent = initialData.likes.length;
//     cardObject.ownerId = initialData.owner['_id'];
//     cardObject.cardId = initialData['_id'];
    
//     if(cardObject.ownerId === userId) {
//         cardObject.buttonDelete.classList.add('photo-grid__delete_active');
//         addEventButtonDelete('click', cardObject, '.photo-grid__element-container');
//     }

//     checkMineLike({userId: userId, arrayLikesPeople: initialData.likes, cardObject: cardObject});
//     addEventLikeButton(cardObject);
//     addEventOpenImagePopup('click', popupImage, cardObject.cardImg, cardObject.cardName);   
//     return cardObject;
// }


// function checkMineLike(settings={userId: null, arrayLikesPeople: null, cardObject: null}) {
//     if(settings.arrayLikesPeople.length) {
//         for(let i = 0; i < settings.arrayLikesPeople.length; i++) {
//             if(settings.arrayLikesPeople[i]['_id'] === settings.userId){
//                 changeColorLikeButton(settings.cardObject);
//                 break;
//             }
//         }
//     }
// }


// function likeCard(evt) {
//     const configForRequest = configTemplate;
//     if(evt.target.classList.contains('photo-grid__like-icon_active')) {
//         configForRequest.options.method = 'DELETE';
//     } else {
//         configForRequest.options.method = 'PUT';
//     }
    
//     getDataOnRequestToServer({
//         configForRequest: configForRequest,
//         targetLink: `cards/likes/${this.cardObject.cardId}`,
//     })
//         .then(card => {
//             this.cardObject.likes.textContent = card.likes.length;
//             changeColorLikeButton(this.cardObject);
//         })
//         .catch(error => {
//             console.log(error);
//         })
// }

// function addEventLikeButton(cardObject) {
//     cardObject.likeButton.addEventListener('click', {handleEvent: likeCard, cardObject: cardObject})
// }

// function removeCard(card) {
//     card.remove();
// }



// function addEventButtonDelete(typeEvent, cardObj, parentClassName) {

//     cardObj.buttonDelete.addEventListener(typeEvent, function(evt) {
//         const currentButtonDelete = evt.target;
//         const cardElement = currentButtonDelete.closest(parentClassName);
//         addEventForConfirmDelete(cardElement, cardObj);
//     });
// }


// function changeColorLikeButton(cardObject) {
//     cardObject.likeButton.classList.toggle('photo-grid__like-icon_active');
//     };

    



// function insertCardOnPage(settings={card: null, confirmDeleteCallback: null}) {             
//     const cardObject = getCardObject(settings.card, userObject['_id'], settings.confirmDeleteCallback);
//         checkLoadImageFromServer(cardObject)                    // Проверяю, могу ли я загрузить картинку, присланную сервером. Если да,
//             .then(res => {                                      // 
//                 insertCardInsideList(res, cardItemsList);       // то отрисовываю на клиенте, если нет, то не рисую. 
//             })                                                  // Повторно на сервер не отправляю
//             .catch(err => {
//                 console.log(`Картинка не загрузилась. ${err.cardImg.src}`);
//             }) 
// }



export {
    Card,
};