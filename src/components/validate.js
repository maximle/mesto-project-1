import {getArrayInputsOfForm} from './utils.js';

function showInputError(formElement, input, errorMessage, validationSettings) {
    validationSettings.setErrorId = input.id;
    const errorElement = formElement.querySelector(validationSettings.errorId);
    input.classList.add(validationSettings.inputErrorClass);
    errorElement.textContent = errorMessage;
    errorElement.classList.add(validationSettings.errorClassActive);
}

function hideInputError(formElement, input, validationSettings) {
    validationSettings.setErrorId = input.id;
    const errorElement = formElement.querySelector(validationSettings.errorId);
    input.classList.remove(validationSettings.inputErrorClass);
    errorElement.textContent = '';
    errorElement.classList.remove(validationSettings.errorClassActive);
}

function hasInvalidInput(formElement, validationSettings) {
    const formInputs = getArrayInputsOfForm(formElement, validationSettings);
    return formInputs.some(input => {
        return !input.validity.valid;
    });
}

function toggleButtonSubmitState(formElement, validationSettings) {
    const buttonSubmit = formElement.querySelector(validationSettings.submitButtonSelector);
    if(hasInvalidInput(formElement, validationSettings)) {
        buttonSubmit.disabled = true;
    } else {
        buttonSubmit.disabled = false;
    }
}

function isValid(formElement, input, validationSettings) {
    if(!input.validity.valid) {
        showInputError(formElement, input, input.validationMessage, validationSettings);
    } else {
        hideInputError(formElement, input, validationSettings);
    }
}

function setEventListenersForInputs(formElement, validationSettings) {
    const formInputs = getArrayInputsOfForm(formElement, validationSettings);
    if(formInputs) {
        formInputs.forEach(input => {
            input.addEventListener('input', () => {
                toggleButtonSubmitState(formElement, validationSettings);
                isValid(formElement, input, validationSettings);
            });
        });
    }
}

function checkValidityOfFields(formElement, validationSettings) {
    const inputsArray = getArrayInputsOfForm(formElement, validationSettings);
    if(inputsArray) {
        inputsArray.forEach(input => {
            if(input.value.length > 0){
                isValid(formElement, input, validationSettings);
            }
        });
    }
    
}


function enableValidationAllForms(validationSettings){
    const forms = Array.from(document.querySelectorAll(validationSettings.formSelector));
    forms.forEach(form => {
        setEventListenersForInputs(form, validationSettings);
    });
}

export {
    checkValidityOfFields,
    enableValidationAllForms,
    toggleButtonSubmitState,
}