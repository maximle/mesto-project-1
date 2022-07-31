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
        const cardItem = this._getCloneNode();
        const newCardObject = {
            set setInitialValues({cardItem, paramsForNewCard, popupWithForm, initialData}) {
                this.cardItem = cardItem;
                this.cardImg = cardItem.querySelector(paramsForNewCard.classOfImage);
                this.cardName = cardItem.querySelector(paramsForNewCard.classOfName);
                this.likeButton = cardItem.querySelector(paramsForNewCard.classOfLike);
                this.buttonDelete = cardItem.querySelector(paramsForNewCard.classOfDelete);
                this.likes = cardItem.querySelector(paramsForNewCard.classOfLikes);
                this.popupWithForm = popupWithForm;
                this.cardImg.src = initialData.link;
                this.cardImg.alt = initialData.name;
                this.cardName.textContent = initialData.name;
                this.likes.textContent = initialData.likes.length;
                this.ownerId = initialData.owner['_id'];
                this.cardId = initialData['_id'];
                this.removeCard = () => {
                    this.buttonDelete.closest(paramsForNewCard.node).remove();
                }
            }
        };

        newCardObject.setInitialValues = {
            cardItem: cardItem,
            paramsForNewCard: this._params,
            popupWithForm: this.popupWithForm,
            initialData: this._initialData,
        };

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
