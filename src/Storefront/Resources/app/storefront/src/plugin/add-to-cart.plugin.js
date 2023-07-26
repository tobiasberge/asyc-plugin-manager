import Plugin from "src/plugin-system/plugin.class";

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

    timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async onClickAddToCart(event) {
        event.preventDefault();

        this.addLoadingIndicator();

        await this.timeout(2000);

        this.addSuccessMessage();
        this.updateCartValue();

        this.$emitter.publish('AddToCartPlugin/afterAdd', this.getCurrentProductPrice());

        await this.timeout(1000);

        this.removeLoadingIndicator();
    }

    updateCartValue() {
        const cartElement = document.querySelector('.shopping-cart');
        const cartValueElement = cartElement.querySelector('.shopping-cart-value');

        const badgeTemplate = `
            <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                1
            </span>
        `;

        cartValueElement.innerText = this.getCurrentProductPrice();
        cartElement.insertAdjacentHTML('afterbegin', badgeTemplate);
    }

    getCurrentProductPrice() {
        const priceElement = document.querySelector('.product-price');

        return priceElement.innerText;
    }
}