import View from './view';
import previewview from './previewview';
import icons from 'url:../../img/icons.svg';
class ResaultsViev extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = `Could not find recipe with your kvery`;
  _message = '';
  _generateMarkup() {
    //console.log(this._data); //ovo je array
    return this._data
      .map(resault => previewview.render(resault, false))
      .join('');
  }
}

export default new ResaultsViev();
