
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
        const config1 = {};
        if(evt.target.classList.contains('photo-grid__like-icon_active')) {
            config1.method = 'DELETE';
        } else {
            config1.method = 'PUT';
        }

        this._api.getDataOnRequestToServer({target: `cards/likes/${this._card.cardId}`, config1: config1})
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

export {
    Card,
};