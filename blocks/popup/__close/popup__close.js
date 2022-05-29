function popupClose() {

    document.querySelectorAll('.popup').forEach(popup => popup.classList.remove('popup_opened'));
}

document.querySelectorAll('.popup__close').forEach(popupCloseButton => popupCloseButton.addEventListener('click', popupClose));
