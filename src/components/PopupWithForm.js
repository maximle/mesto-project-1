import { Popup } from "./Popup.js";

export default class PopupWithForm extends Popup {
  constructor({popupSelector, callbackSubmitForm}) {
      super({popupSelector: popupSelector});
      this._buttonSubmit = this._popup.querySelector('.form__save');
      this._formElement = this._popup.querySelector('.form');
      this._submitBtnText = this._buttonSubmit.textContent;
      this._eventObject = {
          buttonSubmit: this._buttonSubmit,
          formElement: this._formElement,
      };
      this._callbackSubmitForm = callbackSubmitForm.bind(null, this._eventObject);

     this._inputList = Array.from(this._formElement.querySelectorAll('.form__input-text'));
  }


  setEventListener() {
    super.setEventListener();
    this._formElement.addEventListener('submit', this._callbackSubmitForm);
  }

  _removeEventListeners() {
    super._removeEventListeners();
    this._formElement.removeEventListener('submit', this._callbackSubmitForm);
  }

  _fillInitialValuesFields() {
      this._formElement.elements.name.value = this._formElement.elements.name.value;
      this._formElement.elements.description.value = this._formElement.elements.description.value;
  }

  _setInputValues(data) {
    this._inputList.forEach((input) => {
      // тут вставляем в `value` инпута данные из объекта по атрибуту `name` этого инпута
      input.value = data[input.name];
    });
  }

  getInputValues() {
    const formElements = this._formElement.elements;
    const inputValues = {};
    for (let i = 0; i < formElements.length; i++) {
        if (formElements[i].nodeName === 'INPUT') {
            inputValues[formElements[i].name] = formElements[i].value;
        }
    }
    return inputValues
    }

  renderLoading(isLoading, loadingText='Сохранение...') {
    if (isLoading) {
      this._buttonSubmit.textContent = loadingText;
    } else {
      this._buttonSubmit.textContent = this._submitBtnText;
    }
  }

  closePopup(evt) {
      this._removeEventListeners();
      super.closePopup(evt);
      this._formElement.reset();
  }

  openPopup({inputData, cardObject}) {
      this._eventObject.cardObject = cardObject;
      this._eventObject.obj = this;
      if(inputData) {
          this._setInputValues(inputData);
      }
      this.setEventListener();
      super.openPopup();
      console.log(this);
  }
}

export { PopupWithForm }
