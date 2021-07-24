//Update recipe view
import View from './view';
import icons from 'url:../../img/icons.svg';
class Previewview extends View {
  _parentElement = '';
  _generateMarkup() {
    //id služi za dobivanje svih informacija iza hasha odnsono ida
    const id = window.location.hash.slice(1);
    return `<li class="preview">
    <a class="preview__link ${
      //logika za ubacivanje class-a
      this._data.id === id ? 'preview__link--active' : ''
    }" href="#${this._data.id}">
      <figure class="preview__fig">
        <img src="${this._data.image}" alt="${this._data.title}" />
      </figure>
      <div class="preview__data">
        <h4 class="preview__title">
          ${this._data.title}
        </h4>
        <p class="preview__publisher">${this._data.publisher}</p>
      </div>
      <div class="preview__user-generated ${this._data.key ? '' : 'hidden'}">
      <svg>
        <use href="${icons}#icon-user"></use>
      </svg>
    </div>
    </a>
  </li>`;
  }
}

export default new Previewview();
