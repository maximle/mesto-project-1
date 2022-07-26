import { Popup, userName, userAbout } from "./Popup.js";

export default class PopupWithForm extends Popup {
  constructor({selectorPopup, callbackSubmitForm}) {
      super({selectorPopup: selectorPopup});
      this._callbackSubmitForm = callbackSubmitForm;
      this._buttonSubmit = this._selectorPopup.querySelector('.form__save');
      this._formElement = this._selectorPopup.querySelector('.form');
      this._cardElement = null;
      this._cardObject = null;
      this._primaryTextButton = '';
      this._eventObject = {
          handleEvent: this._callbackSubmitForm,
          buttonSubmit: this._buttonSubmit,
          formElement: this._formElement,
      };
  }

  addEventSubmitForForm() {

      if(this._selectorPopup.id === 'confirmDelete') {
          this._buttonSubmit.addEventListener('click', this._eventObject);
      } else {
          this._formElement.addEventListener('submit', this._eventObject);
      }
  }

  _removeFormListener() {
      if(this._selectorPopup.id === 'confirmDelete') {
          this._buttonSubmit.removeEventListener('click', this._eventObject);
      } else {
          this._formElement.removeEventListener('submit', this._eventObject);
      }
      
  }

  _fillInitialValuesFields() {
      this._formElement.elements.name.value = userName.textContent;
      this._formElement.elements.description.value = userAbout.textContent;
  }

  changeButtonTextDuringLoading({loadingText, primaryText}) {
      if(loadingText) {
          this._primaryTextButton = primaryText;
          this._buttonSubmit.textContent = loadingText;
      } else {
          this._buttonSubmit.textContent = this._primaryTextButton;
      }
  }

  closePopup(evt) {
      this._removeFormListener(); 
      super.closePopup(evt);
  }

  openPopup({withInitialValuesFields, cardObject, reset}) {
      this._eventObject.cardObject = cardObject;
      this._eventObject.obj = this;

      if(withInitialValuesFields === true) {
          this._fillInitialValuesFields();
      }
      if(reset) {
          this._formElement.reset();
      }
      this.addEventSubmitForForm();
      super.openPopup();
  }
}

export { PopupWithForm }