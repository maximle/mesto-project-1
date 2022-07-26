class Section {
  constructor({items, renderer}, container) {
      this._data = items;
      this._renderer = renderer;
      this._container = container;
  }


  addItem({element}) {
      this._container.prepend(element.cardItem);
      
  }

  appendCardOnPage() { 
      this._data.forEach(card => {
          this._renderer(card)
              .then(res => { 
                  this.addItem({element: res});
              })
              .catch(err => {
                  console.log(`Ошибка отрисовки карточки. ${err}`);
              })
      });
  }
}

export { Section }