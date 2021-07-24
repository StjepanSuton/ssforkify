import * as model from './model.js';
import recipeView from './viev/recipeview.js'; //importa default
import searchview from './viev/searchview.js';
import resaultsviev from './viev/resaultsviev.js';
import bookmarksview from './viev/bookmarksview.js';
import paginationview from './viev/paginationview.js';
import addRecipeview from './viev/addRecipeview.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime/runtime';
const recipeContainer = document.querySelector('.recipe');

//

///////////////////////////////////////
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return; //Guard clause
    recipeView.renderSpiner();
    // Resaults view to mark selected search resaults
    resaultsviev.update(model.getSearchResaultsPage());
    bookmarksview.update(model.state.bookmarks);
    //Loading recipe
    await model.loadRecipe(id);
    //Rendering recipe
    recipeView.render(model.state.recipe); //metoda koja sprema podatke u cllas
    //HTML template smo dobili od projekta, informacije uzimamo iz objekta recipe
  } catch (err) {
    console.error(err);
    recipeView.renderError(`Could not find recipe`);
  }
};
//U jednoj liniji koda ovo šta smo dole napisali

const controlSearchResaults = async function () {
  try {
    resaultsviev.renderSpiner();
    //console.log(resaultsviev); //da vidimo šta je hzapravo resaultsview ondosno kakav je lanac
    //get search kvery
    const kvery = searchview.getkvery();
    if (!kvery) return;
    // Load search
    await model.loadSearchResaults(kvery);
    // console.log(model.state.search.resaults);
    // Render resaults
    resaultsviev.render(model.getSearchResaultsPage(model.page));

    //Render pagination buttons
    paginationview.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (gotoPage) {
  // Render resaults
  resaultsviev.render(model.getSearchResaultsPage(gotoPage));

  //Render pagination buttons
  paginationview.render(model.state.search);
};
const controlServings = function (newServings) {
  //update recipe servings(in state)
  model.updateServings(newServings);
  // recipeView.render(model.state.recipe);
  //update recipe view
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //Add/remove bookmark
  if (model.state.recipe.bookmarked === false)
    model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  // console.log(model.state.recipe);
  //Update recipe view
  recipeView.update(model.state.recipe);
  //Render bookmarks
  bookmarksview.render(model.state.bookmarks);
};
const controlBookmarks = function () {
  bookmarksview.render(model.state.bookmarks);
};
const controlAddRecipe = async function (newRecipe) {
  try {
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);
    recipeView.render(model.state.recipe);
    //Success message
    addRecipeview.renderMessage();

    //Render bookmark view
    bookmarksview.render(model.state.bookmarks);

    //Change id in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    //Close Form
    setTimeout(function () {
      addRecipeview.toggleWindow();
    }, 2500);
  } catch (err) {
    console.error('mmmmmmmmm', err);
    addRecipeview.renderError(err.message);
  }
};
const init = function () {
  bookmarksview.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes); //Publisher Subscriber patern
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchview.addHandlerSeatch(controlSearchResaults);
  paginationview.addHandlerClick(controlPagination);
  addRecipeview.addHandlerUpload(controlAddRecipe);
};
init();
