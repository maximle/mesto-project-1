class Section {
  constructor({renderer}, container) {
      this._renderer = renderer;
      this._container = container;
  }

  _addItem({element}) {
      this._container.prepend(element.cardItem);
  }

  appendCardOnPage({arrayData}) {
      arrayData.forEach(card => {
          this._renderer(card)
              .then(res => {
                  this._addItem({element: res});
              })
              .catch(err => {
                  console.log(`Ошибка отрисовки карточки. ${err}`);
              })
      });
  }
}

export { Section }
