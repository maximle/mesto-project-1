function popupClose() {
    document.querySelector('.popup').classList.remove('popup_opened');
}

document.querySelector('.popup__close').addEventListener('click', popupClose);
