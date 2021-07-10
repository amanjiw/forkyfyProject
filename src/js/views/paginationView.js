import View from "./View";
import icons from "url:../../img/icons.svg";

class PaginationView extends View {
    _parentElement = document.querySelector(".pagination");

    addHandlerClick(handler){
        this._parentElement.addEventListener("click",function(event){
            const btn = event.target.closest(".btn--inline");
            if(!btn) return;
            const gotoPage = Number(btn.dataset.goto);
            handler(gotoPage);
        })


    }
    _generateMarkup() {
        const currentPage = this._data.page;
        const numPage = Math.ceil(this._data.results.length / this._data.resultPerPage);

        //page 1 and there are other pages
        if (currentPage === 1 && numPage > 1) {
            return `
            <button data-goto ="${currentPage + 1}" class="btn--inline pagination__btn--next">
            <span>Page${currentPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
            `
        }

        // other pages
        if (currentPage < numPage) {
            return `
            <button data-goto ="${currentPage - 1}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page${currentPage - 1}</span>
          </button>
          <button data-goto ="${currentPage + 1}" class="btn--inline pagination__btn--next">
            <span>Page${currentPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
            `
        }

        //las page 
        if (currentPage === numPage && numPage>1) {
            return `
            <button data-goto ="${currentPage - 1}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page${currentPage - 1}</span>
          </button>
            
            `
        }
        //page 1 and thers are no other pages
        return "";
    }   


}


export default new PaginationView();