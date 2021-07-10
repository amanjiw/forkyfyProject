
import * as model from "./model.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultView from "./views/resultView.js";
import paginationView from "./views/paginationView.js";
import bookmarkView from "./views/bookmarkView.js";
import addRecipeView from "./views/addRecipeView.js";
import "regenerator-runtime/runtime";
import "core-js/stable";
import { async } from "regenerator-runtime/runtime";

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {

  try {
    const id = window.location.hash.slice(1);
    if (!id) return
    recipeView.rederSpinner();
    await model.loadRecipe(id);
    recipeView.render(model.state.recipe);
    resultView.update(model.getSerachResultPage(1));
    bookmarkView.update(model.state.bookmarks);
    console.log(model.state.recipe)


  }
  catch (err) {
    console.log(err);
    recipeView.renderError();
  }


}



const controlSearchResults = async function () {
  try {
    const query = searchView.getQuery();
    resultView.rederSpinner();
    await model.loadSearchResults(query);
    resultView.render(model.getSerachResultPage(1));
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
    recipeView.renderError();
  }
};


const controlPagination = function (goto) {
  resultView.render(model.getSerachResultPage(goto));
  paginationView.render(model.state.search);

}

const controlServing = function (serving) {
  model.updateServing(serving);
  recipeView.update(model.state.recipe);
}

const controlAddBookmark = function () {

  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe)
  else model.deldeteBookmark(model.state.recipe.id)
  recipeView.update(model.state.recipe);
  bookmarkView.render(model.state.bookmarks);

}

const constrolBookmarks = function () {
  bookmarkView.render(model.state.bookmarks);
}


const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.rederSpinner();
    await model.uploadRecipe(newRecipe);
    recipeView.render(model.state.recipe);
    bookmarkView.render(model.state.bookmarks);
    window.history.pushState(null,"",`#${model.state.recipe.id}`)
    //show success Message
    addRecipeView.renderMessage();
    //cloase the addRecipeWindow
    setTimeout(function () {

      addRecipeView.toggleWindow()

    }, 2000)
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
}


const newfeacher = function(){

  console.log("Developed By Amanji :)")

}

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServing(controlServing)
  recipeView.addHandlerBookmark(controlAddBookmark);
  searchView.addHanderSearch(controlSearchResults);
  bookmarkView.addHandlerBookmark(constrolBookmarks);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUploadRecipe(controlAddRecipe);
  newfeacher();
}

init();
//