import Popup from './Popup.js'

class PopupWithImage extends Popup {
  constructor({selectorPopup}) {
      super({selectorPopup: selectorPopup});
      this._elementImageOfPopupImage = this._selectorPopup.querySelector('.popup__image');
      this._elementCaptionOfPopupImage = this._selectorPopup.querySelector('.popup__image-caption');
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