import View from "./View";
import previewView from "./previewView";
import icons from "url:../../img/icons.svg";
class BookmarkView extends View {
    _parentElement = document.querySelector(".bookmarks__list");
    _errorMessage = "No Bookmark Yet! Finde A Nice Recipe And Bookmark It :) ";
    _message = ""

    _generateMarkup() {

        return this._data.map(bookmark => previewView.render(bookmark, false)).join("");
    }

    addHandlerBookmark = function (handler) {
        window.addEventListener("load", function () {
            handler();
        })
    }

}


export default new BookmarkView();