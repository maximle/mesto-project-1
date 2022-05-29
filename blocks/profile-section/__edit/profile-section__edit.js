const editProfile = document.querySelector('#editProfile');

document.querySelector('.profile-section__edit').addEventListener('click', function () {

    editProfile.classList.add('popup_opened');

    for (let input of editProfile.querySelectorAll('.form__input-text')) {
        if (input.getAttribute('name') === 'name') {
            input.value = document.querySelector('.profile-section__name').textContent;
        } else if (input.getAttribute('name') === 'description') {
            input.value = document.querySelector('.profile-section__text').textContent;
        }
    }

});


function formSaveHandler(evt) {
    evt.preventDefault();

    let userName = document.querySelector('.profile-section__name');
    let userDescription = document.querySelector('.profile-section__text');

    for (let input of editProfile.querySelectorAll('.form__input-text')) {
        if (input.getAttribute('name') === 'name') {
            userName.textContent = input.value;
        } else if (input.getAttribute('name') === 'description') {
            userDescription.textContent = input.value;
        }
    }

    popupClose();
}

editProfile.addEventListener('submit', formSaveHandler);

