
let primaryTextButton = '';




export function getArrayInputsOfForm(formElement, validationSettings) {
    if(formElement.querySelector(validationSettings.inputSelector)) {
        return Array.from(formElement.querySelectorAll(validationSettings.inputSelector));
    } else {
        return false;
    }
}



export function changeButtonTextDuringLoading(settings={
    button: null,
    loadingText: null,
    primaryText: null,
}) {
    if(settings.loadingText) {
        primaryTextButton = settings.primaryText;
        settings.button.textContent = settings.loadingText;
    } else {
        settings.button.textContent = primaryTextButton;
    }
}