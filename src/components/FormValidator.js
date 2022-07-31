
export default class FormValidator {
    constructor(formElement, validationConfig) {
        this.validationConfig = validationConfig;
        this.formElement = formElement;
    }

    _showInputError = (formElement, inputElement, errorMessage, validationConfig) => {

        this.errorElement = formElement.querySelector(`.${inputElement.id}-error`);
        inputElement.classList.add(validationConfig.inputErrorClass);
        this.errorElement.textContent = errorMessage;
        this.errorElement.classList.add(validationConfig.errorClassActive);
    };
  
    _hideInputError = (formElement, inputElement, validationConfig) => {
        this.errorElement = formElement.querySelector(`.${inputElement.id}-error`);
        inputElement.classList.remove(validationConfig.inputErrorClass);
        this.errorElement.textContent = '';
        this.errorElement.classList.remove(validationConfig.errorClassActive);
    };

    _checkInputValidity(formElement, inputElement, validationConfig) {
        if (!inputElement.validity.valid) {
            this._showInputError(formElement, inputElement, inputElement.validationMessage, validationConfig);
        } else {
            this._hideInputError(formElement, inputElement, validationConfig);
        }
    };


     _hasInvalidInput(inputList) {
      return inputList.some((inputElement) => {
        return !inputElement.validity.valid;
      })
    };

    _toggleButtonState(formElement, buttonElement, validationConfig) {
        if (this._hasInvalidInput(this.inputList)) {
          buttonElement.disabled = true;
        } else {
          buttonElement.disabled = false;
        }
    };

    _setEventListener(formElement, validationConfig) {
        this.inputList = Array.from(formElement.querySelectorAll(validationConfig.inputSelector));
        this.buttonElement = formElement.querySelector(validationConfig.submitButtonSelector);
      
        this._toggleButtonState(this.inputList, this.buttonElement, validationConfig);
      
        this.inputList.forEach((inputElement) => {
          inputElement.addEventListener('input', () => {
            this._checkInputValidity(formElement, inputElement, validationConfig);
            this._toggleButtonState(this.inputList, this.buttonElement, validationConfig);
          });
        });
    };

    enableValidation() {
        this.formElement.addEventListener('submit', (evt) => {
            evt.preventDefault();
        });
        
        this._setEventListener(this.formElement, this.validationConfig);
    }
}

export { FormValidator }