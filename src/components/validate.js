import {getArrayInputsOfForm} from './utils.js';

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
        console.log(this.formElement)
        this.formElement.addEventListener('submit', (evt) => {
            evt.preventDefault();
        });
        
        this._setEventListener(this.formElement, this.validationConfig);
    }
}

export { FormValidator }
// function showInputError(formElement, input, errorMessage, validationSettings) {
//     validationSettings.setErrorId = input.id;
//     const errorElement = formElement.querySelector(validationSettings.errorId);
//     input.classList.add(validationSettings.inputErrorClass);
//     errorElement.textContent = errorMessage;
//     errorElement.classList.add(validationSettings.errorClassActive);
// }

// function hideInputError(formElement, input, validationSettings) {
//     validationSettings.setErrorId = input.id;
//     const errorElement = formElement.querySelector(validationSettings.errorId);
//     input.classList.remove(validationSettings.inputErrorClass);
//     errorElement.textContent = '';
//     errorElement.classList.remove(validationSettings.errorClassActive);
// }

// function hasInvalidInput(formElement, validationSettings) {
//     const formInputs = getArrayInputsOfForm(formElement, validationSettings);
//     return formInputs.some(input => {
//         return !input.validity.valid;
//     });
// }

// function toggleButtonSubmitState(formElement, validationSettings) {
//     const buttonSubmit = formElement.querySelector(validationSettings.submitButtonSelector);
//     if(hasInvalidInput(formElement, validationSettings)) {
//         buttonSubmit.disabled = true;
//     } else {
//         buttonSubmit.disabled = false;
//     }
// }

// function isValid(formElement, input, validationSettings) {
//     if(!input.validity.valid) {
//         showInputError(formElement, input, input.validationMessage, validationSettings);
//     } else {
//         hideInputError(formElement, input, validationSettings);
//     }
// }

// function setEventListenersForInputs(formElement, validationSettings) {
//     const formInputs = getArrayInputsOfForm(formElement, validationSettings);
//     if(formInputs) {
//         formInputs.forEach(input => {
//             input.addEventListener('input', () => {
//                 toggleButtonSubmitState(formElement, validationSettings);
//                 isValid(formElement, input, validationSettings);
//             });
//         });
//     }
// }

// function checkValidityOfFields(formElement, validationSettings) {
//     const inputsArray = getArrayInputsOfForm(formElement, validationSettings);
//     if(inputsArray) {
//         inputsArray.forEach(input => {
//             if(input.value.length > 0){
//                 isValid(formElement, input, validationSettings);
//             }
//         });
//     }
    
// }


// function enableValidationAllForms(validationSettings){
//     const forms = Array.from(document.querySelectorAll(validationSettings.formSelector));
//     forms.forEach(form => {
//         setEventListenersForInputs(form, validationSettings);
//     });
// }

// export {
//     checkValidityOfFields,
//     enableValidationAllForms,
//     toggleButtonSubmitState,
// }