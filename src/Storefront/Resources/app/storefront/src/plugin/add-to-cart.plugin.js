import Plugin from "src/plugin-system/plugin.class";
import throttle from "src/helper/throttle.helper";

export default class AddToCartPlugin extends Plugin {
    init() {
        this.addEventListeners();
    }

    addEventListeners() {
        this.el.addEventListener('click', this.onClickAddToCart.bind(this));
    }

    addLoadingIndicator() {
        this.el.setAttribute('disabled', 'disabled');

        this.el.innerHTML = `
            <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
            Adding to cart...
        `;
    }

    addSuccessMessage() {
        this.el.innerHTML = `
            <i class="bi bi-check-circle-fill"></i>
        `;
    }

    removeLoadingIndicator() {
        this.el.removeAttribute('disabled');

        this.el.innerHTML = 'Add to cart';
    }

    async onClickAddToCart(event) {
        event.preventDefault();

        this.addLoadingIndicator();

        await throttle(2000);

        this.addSuccessMessage();

        this.$emitter.publish('AddToCartPlugin/afterAdd', this.getCurrentProductPrice());

        await throttle(1000);

        this.removeLoadingIndicator();
    }

    getCurrentProductPrice() {
        const priceElement = document.querySelector('.product-price');

        return priceElement.innerText;
    }
}