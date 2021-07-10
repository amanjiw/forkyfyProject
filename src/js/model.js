import { async } from "regenerator-runtime"
import { API_URL, RES_PER_PAGE, KEY } from "./config";
import { AJAX } from "./helper";
export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
        resultPerPage: RES_PER_PAGE,
        page: 1,
    },
    bookmarks: [],
};



const creatRecipeObject = function (data) {
    let { recipe } = data.data;
    return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        image: recipe.image_url,
        serving: recipe.servings,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients,
        ...(recipe.key && { key: recipe.key })
    };
}


export const loadRecipe = async function (id) {

    try {
        const data = await AJAX(`${API_URL}/${id}?key=${KEY}`);
        state.recipe = creatRecipeObject(data);
        if (state.bookmarks.some(bookmark => bookmark.id === id))
            state.recipe.bookmarked = true;
        else state.recipe.bookmarked = false;
    }
    catch (err) {
        throw err;
    }
};


export const loadSearchResults = async function (query) {
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    state.search.results = data.data.recipes.map(rec => {
        return {
            id: rec.id,
            title: rec.title,
            publisher: rec.publisher,
            image: rec.image_url,
            ...(rec.key && { key: rec.key })
        }
    });
    state.search.page = 1;
};


const persistBookmark = function () {
    localStorage.setItem("bookmark", JSON.stringify(state.bookmarks));
};

export const getSerachResultPage = function (page) {
    state.search.page = page;
    const start = (page - 1) * state.search.resultPerPage;
    const end = page * state.search.resultPerPage;
    return state.search.results.slice(start, end);
};


export const updateServing = function (newServing) {

    state.recipe.ingredients.forEach(ing => {
        ing.quantity = ing.quantity * newServing / state.recipe.serving;
    });
    state.recipe.serving = newServing;
};


export const addBookmark = function (recipe) {

    state.bookmarks.push(recipe);
    if (recipe.id === state.recipe.id) {
        state.recipe.bookmarked = true;
        persistBookmark();
    }
};

export const deldeteBookmark = function (id) {
    const index = state.bookmarks.findIndex(bookmark => bookmark.id === id);
    if (id === state.recipe.id) {
        state.bookmarks.splice(index, 1);
        state.recipe.bookmarked = false;
        persistBookmark();
    }
};


export const uploadRecipe = async function (newRecipe) {
    try {

        const ingredients = Object.entries(newRecipe).filter(entry => entry[0].startsWith("ingredient") && entry[1] !== "")
            .map(ing => {
                const ingArr = ing[1].replaceAll(" ", "").split(",");
                if (ingArr.length !== 3) throw new Error("Wrong Ingredient Format! Please Use The Currect Format :)");
                const [quantity, unit, description] = ingArr;
                return { quantity: quantity ? +quantity : null, unit, description }

            });


        const recipe = {
            title: newRecipe.title,
            source_url: newRecipe.sourceUrl,
            image_url: newRecipe.image,
            publisher: newRecipe.publisher,
            cooking_time: +newRecipe.cookingTime,
            servings: +newRecipe.servings,
            ingredients,

        };


        const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);

        state.recipe = creatRecipeObject(data);
        addBookmark(state.recipe);


    } catch (err) {
        console.log(err)
        throw err;
    }
}


const init = function () {
    const storage = localStorage.getItem("bookmark");
    if (storage) state.bookmarks = JSON.parse(storage);
}

init();