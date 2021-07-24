import View from './view';
import icons from 'url:../../img/icons.svg';
class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    //dodavanje elemenata naknado unutar objekta Htmla OVO MI TRIBA
    this._parentElement.addEventListener('click', function (e) {
      //Dodajemo event listener na najbližeg roditelja što je u ovom slučaju pagination
      const btn = e.target.closest('.btn--inline'); //closest koristimo da slučajno ne kliknemo na nešto drugo osim botuna
      if (!btn) return;
      // console.log(btn);
      const gotoPage = +btn.dataset.goto; //da dobijemo broj iz htmla kojeg smo ubacili data-goto="${curPage + 1}"
      handler(gotoPage);
    });
  }

  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.resaults.length / this._data.resaultsperPage
    ); //koliko ima stranica
    //console.log(numPages);
    //page 1 and there are other pages
    if (curPage === 1 && numPages > 1) {
      //ako je trenutna stranica jednaka 1 i broj stranica je veći od 1
      return `
    <button data-goto="${
      curPage + 1
    }" class="btn--inline pagination__btn--next">
      <span>${curPage + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>`;
    }

    //Last page
    if (curPage === numPages && numPages > 1) {
      //ako je trenutna stranica jednaka zadnjoj stranici i broj stranica je veći od 1
      return `<button data-goto="${
        curPage - 1
      }" class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>${curPage - 1}</span>
    </button>
  `;
    }
    //Other Page
    if (curPage < numPages) {
      return `<button data-goto="${
        curPage - 1
      }" class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>${curPage - 1}</span>
    </button>
    <button data-goto="${
      curPage + 1
    }" class="btn--inline pagination__btn--next">
      <span>${curPage + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>
  `;
    }
    //page 1 nema drugih
    return '';
  }
}
export default new PaginationView();
