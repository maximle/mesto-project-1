import Popup from './Popup.js'

class PopupWithImage extends Popup {
  constructor({popupSelector}) {
      super({popupSelector: popupSelector});
      this._elementImageOfPopupImage = this._popup.querySelector('.popup__image');
      this._elementCaptionOfPopupImage = this._popup.querySelector('.popup__image-caption');
  }


  openPopup({cardObject}) {
      this._elementImageOfPopupImage.src = cardObject.cardImg.src;
      this._elementImageOfPopupImage.alt = cardObject.cardImg.alt;
      this._elementCaptionOfPopupImage.textContent = cardObject.cardName.textContent;
      super.openPopup();
  }

}

export {
  PopupWithImage
}
