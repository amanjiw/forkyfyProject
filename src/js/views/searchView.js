class SearchView {
    _parentelement = document.querySelector(".search");


    getQuery() {
        const query = this._parentelement.querySelector(".search__field").value;
        this._clearInput();
        return query;
    }

    _clearInput() {

        this._parentelement.querySelector(".search__field").value = "";
    }


    addHanderSearch(handler) {

        this._parentelement.addEventListener("submit", function (event) {
            event.preventDefault();
            handler();
            
        })


    }


}


export default new SearchView();