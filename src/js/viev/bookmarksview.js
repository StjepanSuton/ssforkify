import View from './view';
import icons from 'url:../../img/icons.svg';
import previewview from './previewview';
class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = `No bookmarks yet`;
  _message = '';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }
  _generateMarkup() {
    //console.log(this._data); //ovo je array
    return this._data
      .map(bookmark => previewview.render(bookmark, false))
      .join('');
  }
}

export default new BookmarksView();
