document.querySelectorAll('.photo-grid__delete').forEach(buttonDelete => 
    buttonDelete.addEventListener('click', function(evt) {
        const currentButtonDelete = evt.target;
        const cardElement = currentButtonDelete.closest('.photo-grid__element-container');

        cardElement.remove();
}));