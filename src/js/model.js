import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config.js';
import { AJAX } from './helper.js';
export const state = {
  recipe: {},
  search: {
    kvery: '',
    resaults: [],
    resaultsperPage: RES_PER_PAGE,
    page: 1,
  },
  bookmarks: [],
};
const createRecipeObject = function (data) {
  const { recipe } = data.data; //drugi data je iz objkta samog jsona pretvaramo ga u malo lijepši objekt
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }), //ako recipe.key ne postoji destrukturiranje ne radi ništa a ako ima vrati se
    //{key: recipe.key} zatim taj value spredamo ...
  };
};
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}`); //dobivamo data iz helper funkcije,pogledat JSON u helper funkciji
    state.recipe = createRecipeObject(data);
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    //Temp error handeling
    console.error(`${err} &&&&&&`);
    throw err;
  }
};
export const loadSearchResaults = async function (kvery) {
  try {
    state.search.kvery = kvery;
    const { data } = await AJAX(`${API_URL}?search=${kvery}&key=${KEY}`);
    console.log(data);
    state.search.resaults = data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        sourceUrl: rec.source_url,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1;
    console.log(state.search.page);
  } catch (err) {
    console.error(err);
    throw err;
  }
};
export const getSearchResaultsPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resaultsperPage; //0; //amo reć da smo rekvestali page 1 ,(1-1)*10 je 0 pa sliceamo pozciju 0,
  //zatim ako je page 2 ,(2,-1)*10 je 10 i od tuda kreće druga stranica
  const end = page * state.search.resaultsperPage; //9
  return state.search.resaults.slice(start, end);
};
export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;

    //newKv = oldKv * newServings/oldServings  });
  });
  console.log(newServings);
  state.recipe.servings = newServings;
};
const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks)); //spremanje u local storage kao string
  //gdje je state.bookmarks stvar koju spremamo
};
export const addBookmark = function (recipe) {
  //Add bookmark
  state.bookmarks.push(recipe);
  //Mark current recipe as bookmark
  if (recipe.id === state.recipe.id) {
    state.recipe.bookmarked = true;
    persistBookmarks();
  }
};
export const deleteBookmark = function (id) {
  //Delete bookmark
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);
  //Mark current recipe as NOT bookmark
  if (id === state.recipe.id) {
    state.recipe.bookmarked = false;
    persistBookmarks();
  }
};
const initt = function () {
  const storgae = localStorage.getItem('bookmarks'); //dozivamo spremljeno
  if (storgae) state.bookmarks = JSON.parse(storgae); //pretvaramo nazad u objekt
};
initt();
console.log(state.bookmarks);
const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
//clearBookmarks(); //da se na početku očiste bookmarksi
export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].replaceAll(' ', '').split(',');
        if (ingArr.length !== 3) throw new Error('Wrong ing format');
        const [kvantinity, unit, description] = ingArr;
        return {
          kvantinity: kvantinity ? +kvantinity : null,
          unit,
          description,
        };
      });
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: newRecipe.cookingTime,
      servings: newRecipe.servings,
      ingredients,
    };
    console.log(recipe.title);
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    console.log(data);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
