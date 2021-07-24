class SearchView {
  _parentEL = document.querySelector('.search'); //selektiranje parent elementa za dobit value iz searcha
  getkvery() {
    const kvery = this._parentEL.querySelector('.search__field').value; //dobiveni value iz searcha
    this._clearInput();
    return kvery;
  }
  _clearInput() {
    this._parentEL.querySelector('.search__field').value = '';
  }
  addHandlerSeatch(handler) {
    this._parentEL.addEventListener('submit', function (e) {
      //radnja će se desiti bez obszira klikne li
      //korisnik botun ili stisne enter
      e.preventDefault(); //kada submitamo form potrebno je ovo napraviti inače će se page reloadat
      handler();
    });
  }
}
export default new SearchView();
