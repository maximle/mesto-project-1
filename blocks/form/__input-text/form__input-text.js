for (let input of document.querySelectorAll('.form__input-text')) {
    if (input.getAttribute('name') === 'name') {
        input.value = document.querySelector('.profile-section__name').textContent;
    } else if (input.getAttribute('name') === 'description') {
        input.value = document.querySelector('.profile-section__text').textContent;
    }
}

