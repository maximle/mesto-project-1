export default class Popup {
    constructor({popupSelector}) {
        this._popup = document.querySelector(popupSelector);
        this._buttonClose = this._popup.querySelector('.popup__close');
        this.boundClosePopup = this.closePopup.bind(this);
        this.boundClosePopupToKey = this._closePopupToKey.bind(this);
        this.boundClosePopupToOverlay = this._closePopupToOverlay.bind(this);
    }

    _removeEventListeners(evt) {
        this._popup.removeEventListener('click', this.boundClosePopupToOverlay);
        this._buttonClose.removeEventListener('click', this.boundClosePopup);
        document.removeEventListener('keydown', this.boundClosePopupToKey);
    }

    _closePopupToKey(evt) {
        if (evt.key === 'Escape') {
          this.closePopup(evt);
        }
    }

    _closePopupToOverlay(evt) {
        if (!(evt.target.closest('.popup__container'))) {
            this.closePopup(evt);
        }
    }

    closePopup(evt) {
        this._popup.classList.remove('popup_opened');
        this._removeEventListeners(evt);
        // console.log(this);
    }

    openPopup() {
        // console.log(this);
        this._popup.classList.add('popup_opened');
        this.setEventListener();
    }

    setEventListener() {
        this._buttonClose.addEventListener('click', this.boundClosePopup);
        document.addEventListener('keydown', this.boundClosePopupToKey);
        this._popup.addEventListener('click', this.boundClosePopupToOverlay);
    }
}




export {
    Popup
}
