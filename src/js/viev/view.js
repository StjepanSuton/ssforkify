import icons from 'url:../../img/icons.svg';
export default class View {
  _data;
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const markup = this._generateMarkup();
    if (render == false) return markup;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    this._data = data;
    const newmarkup = this._generateMarkup();

    //Kreira falši DOM od newmarkup
    const newDOM = document.createRange().createContextualFragment(newmarkup); //pretvorit će string u DOM object
    //radimo array od novog falxeg doma
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    //radimo array od starog doma
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));
    //vidimo razliku između starog i novog doma
    //Ovdje je razlika u span.recipe__info-data.recipe__info-data--people inner html di je u new element 5 ,a u starome 4
    //console.log(newElements, curElements);
    //loopamo kroz elemente falšeg doma i stvarnog doma
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      //isEqualNode uspoređuje nodove i tako ako nodovi curEla odnosno stvarnog doma nisu isti sa novim falšim domom daje false
      // console.log(curEl, newEl.isEqualNode(curEl));
      //Ovaj dio mijenja samo tekst i stoga budući da je početno stanje 4
      // +- vrte samo 5 i 3 jer stanje je uvijek 4 jer ga ne ažuriramo i kada stisnemo botun stanje se automatki uvijek vrati na 4
      if (
        !newEl.isEqualNode(curEl) && //ako su različiti
        //Value of node value će biti null ako je element sve osim teksta
        //budući da ovdje želimo zamijeniti tekst to je isto uvjet
        //trbemo izabrati child a ne cijeli element zato što je child zapravo dio koji sadrži tekst
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        //console.log(newEl.firstChild.nodeValue.trim());
        //zamijenjujemo stari curEl s novim
        curEl.textContent = newEl.textContent;
      }
      //mijenja da stanje nije uvijek 4
      if (!newEl.isEqualNode(curEl)) {
        //daje listu svih promijenjenih atributa kao objket
        //  console.log(newEl.attributes);
        //Zatim mijenjamo value atributa starog curEl s novim newEl s donjom funckijom i to je to
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }
  _clear() {
    this._parentElement.innerHTML = '';
  }
  renderSpiner = function () {
    //Generiranje spinera
    //Spiner se izbriše zbog .innerHTML = ''; dolje
    const markup = `<div class="spinner">
    <svg>
      <use href="${icons}#icon-loader"></use>
    </svg>
  </div>`;

    this._clear();

    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  };
  renderError(message = this._errorMessage) {
    const markup = `<div class="error">
    <div>
      <svg>
        <use href="${icons}#icon-alert-triangle"></use>
      </svg>
    </div>
    <p>${message}</p>
  </div>`;
    this._clear();

    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  renderMessage(message = this._message) {
    const markup = `<div class="message">
    <div>
      <svg>
        <use href="${icons}#icon-smile"></use>
      </svg>
    </div>
    <p>${message}</p>
  </div>`;
    this._clear();

    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
