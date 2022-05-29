document.querySelectorAll('.photo-grid__like-icon').forEach(likeButton => likeButton.addEventListener('click', function() {
    likeButton.classList.toggle('photo-grid__like-icon_active');
}));