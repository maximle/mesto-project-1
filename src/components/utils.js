export function getCloneNode(template, desiredNode) {
    const photoGridItemTemplate = document.querySelector(template).content;
    return photoGridItemTemplate.querySelector(desiredNode).cloneNode(true);
}



export function getArrayInputsOfForm(formElement, validationSettings) {
    return Array.from(formElement.querySelectorAll(validationSettings.inputSelector));
}

