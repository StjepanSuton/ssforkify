import View from './view';
import icons from 'url:../../img/icons.svg';
class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'YeYYYYYYYYYYYY :)';
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }
  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }
  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }
  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }
  //// handler koji pozivamo
  /*
const controlAddRecipe = function (newRecipe) {
  console.log(newRecipe);
*/
  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArray = [...new FormData(this)]; //kada ima više valuea za formu da nemoramo selektirat svaki value
      const data = Object.fromEntries(dataArray); // pretvara array u object
      handler(data); //handler iz controlera
    });
  }

  _generateMarkup() {}
}
export default new AddRecipeView();
