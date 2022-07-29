export default class Card {
    constructor({params, api, popupOpenImage, popupWithForm}) {
        this._initialData = null;
        this._api = api;
        this.popupOpenImage = popupOpenImage;
        this.popupWithForm = popupWithForm;
        this._userId = null;
        this._params = params;
        this.cardElement = null;
        this.card = {};
        this.cardsArray = [];
    } 

    _getCloneNode() {
        const photoGridItemTemplate = document.querySelector(this._params.template).content;
        return photoGridItemTemplate.querySelector(this._params.node).cloneNode(true);
    }


    _makeCardObject() {
        // const cardItem = this._getCloneNode();
        // const paramsForNewCard = this._params;
        // const newCardObject = {
        //     params: paramsForNewCard,
        //     cardItem: cardItem,
        //     cardImg: this.cardItem.querySelector(this.params.classOfImage),
        //     cardName: this.cardItem.querySelector(this.params.classOfName),
        //     likeButton: this.cardItem.querySelector(this.params.classOfLike),
        //     buttonDelete: this.cardItem.querySelector(this.params.classOfDelete),
        //     likes: this.cardItem.querySelector(this.params.classOfLikes),
        //     ownerId: '',
        //     cardId: '',
        //     removeCard: function () {
        //         const cardElement = this.buttonDelete.closest(this._params.node);
        //         cardElement.remove();
        //     }
        // };
        const newCardObject = {};
        newCardObject.cardItem = this._getCloneNode();
        newCardObject.cardImg = newCardObject.cardItem.querySelector(this._params.classOfImage);
        newCardObject.cardName = newCardObject.cardItem.querySelector(this._params.classOfName);
        newCardObject.likeButton = newCardObject.cardItem.querySelector(this._params.classOfLike);
        newCardObject.buttonDelete = newCardObject.cardItem.querySelector(this._params.classOfDelete);
        newCardObject.likes = newCardObject.cardItem.querySelector(this._params.classOfLikes);
        newCardObject.ownerId = '';
        newCardObject.cardId = '';
        newCardObject.popupWithForm = this.popupWithForm;
        const cardElement = newCardObject.buttonDelete.closest(this._params.node);
        newCardObject.removeCard = function () {
            cardElement.remove();
        }

        newCardObject.cardImg.src = this._initialData.link;
        newCardObject.cardImg.alt = this._initialData.name;
        newCardObject.cardName.textContent = this._initialData.name;
        newCardObject.likes.textContent = this._initialData.likes.length;
        newCardObject.ownerId = this._initialData.owner['_id'];
        newCardObject.cardId = this._initialData['_id'];
        return newCardObject;
    }

    _addEventButtonDelete(card) {
        if(card.ownerId === this._userId) {
            card.buttonDelete.classList.add('photo-grid__delete_active');
            card.buttonDelete.addEventListener('click', this.popupWithForm.openPopup.bind(this.popupWithForm, {cardObject: card}));        
        }
    }


    _checkMineLike(card) {
        if(this._initialData.likes.length) {
            for(let i = 0; i < this._initialData.likes.length; i++) {
                if(this._initialData.likes[i]['_id'] === this._userId){
                    
                    this._changeColorLikeButton(card);
                    break;
                }
            }
        }
    }

    _changeColorLikeButton(card) {
        card.likeButton.classList.toggle('photo-grid__like-icon_active');
    }

    _addEventLikeButton(card) {
        card.likeButton.addEventListener('click', this._likeCard.bind(this, card));
    }

    _likeCard(card, evt) {
        const config1 = {};
        if(evt.target.classList.contains('photo-grid__like-icon_active')) {
            config1.method = 'DELETE';
        } else {
            config1.method = 'PUT';
        }

        this._api.getDataOnRequestToServer({target: `cards/likes/${card.cardId}`, config1: config1})
            .then(cardObj => {
                card.likes.textContent = cardObj.likes.length;
                this._changeColorLikeButton(card);
            })
            .catch(error => {
                console.log(error);
            })
    }

    _addEventOpenImagePopup(card) {
        card.cardImg.addEventListener('click', this.popupOpenImage.openPopup.bind(this.popupOpenImage, {cardObject: card}));
    }

    
    setUserId({userId}) {
        this._userId = userId;
    }

    getCardsArray({initialDataArray}) {
        initialDataArray.forEach(card => {
            const cardObject = this.getCard({initialData: card});
            this.cardsArray.push(cardObject);
        });
        return this.cardsArray;
    }

 

    getCard({initialData}) {
        this._initialData = initialData;
        const card = this._makeCardObject();
        this._checkMineLike(card);
        this._addEventButtonDelete(card);
        this._addEventLikeButton(card);
        if(this.popupOpenImage) {
            this._addEventOpenImagePopup(card);
        }
        return card;
    }

}
