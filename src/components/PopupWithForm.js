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

<<<<<<< HEAD
=======

>>>>>>> 71c7814fd39284acc20cef4620907b9caf93440b
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
<<<<<<< HEAD
      
=======

>>>>>>> 71c7814fd39284acc20cef4620907b9caf93440b
  }

  _fillInitialValuesFields() {
      this._formElement.elements.name.value = userName.textContent;
      this._formElement.elements.description.value = userAbout.textContent;
  }

<<<<<<< HEAD
=======
  getInputValues() {
    const formElements = this._formElement.elements;
    const inputValues = {};
    for (let i = 0; i < formElements.length; i++) {
        if (formElements[i].nodeName === 'INPUT') {
            console.log(formElements[i].name.value);
            inputValues[formElements[i].name] = formElements[i].value;
        }
    }
    return inputValues
    }

>>>>>>> 71c7814fd39284acc20cef4620907b9caf93440b
  changeButtonTextDuringLoading({loadingText, primaryText}) {
      if(loadingText) {
          this._primaryTextButton = primaryText;
          this._buttonSubmit.textContent = loadingText;
      } else {
          this._buttonSubmit.textContent = this._primaryTextButton;
      }
  }

  closePopup(evt) {
<<<<<<< HEAD
      this._removeFormListener(); 
=======
      this._removeFormListener();
>>>>>>> 71c7814fd39284acc20cef4620907b9caf93440b
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

<<<<<<< HEAD
export { PopupWithForm }
=======
export { PopupWithForm }
>>>>>>> 71c7814fd39284acc20cef4620907b9caf93440b
