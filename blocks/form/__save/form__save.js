function formSaveHandler(evt) {
    evt.preventDefault();

    let userName = document.querySelector('.profile-section__name');
    let userDescription = document.querySelector('.profile-section__text');

    for (let input of document.querySelectorAll('.form__input-text')) {
        if (input.getAttribute('name') === 'name') {
            userName.textContent = input.value;
        } else if (input.getAttribute('name') === 'description') {
            userDescription.textContent = input.value;
        }
    }

    popupClose();
}

document.querySelector('.form').addEventListener('submit', formSaveHandler);


