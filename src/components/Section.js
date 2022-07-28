class Section {
  constructor({items, renderer}, container) {
      this._data = items;
      this._renderer = renderer;
      this._container = container;
  }

<<<<<<< HEAD

  addItem({element}) {
      this._container.prepend(element.cardItem);
      
=======
  addItem({element}) {
      this._container.prepend(element.cardItem);   
>>>>>>> 71c7814fd39284acc20cef4620907b9caf93440b
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