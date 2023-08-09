import Plugin from 'src/plugin-system/plugin.class';
import throttle from 'src/helper/throttle.helper';

export default class CartPlugin extends Plugin {
    static options = {
        addToCartSelector: '[data-add-to-cart]',
    }

    init() {
        this.registerEvents();
    }

    registerEvents() {
        this.el.addEventListener('click', this.openOffCanvasCart.bind(this));
        this.subscribeAddToCartEvent();
    }

    subscribeAddToCartEvent() {
        const addToCartBtn = document.querySelector(this.options.addToCartSelector);

        if (!addToCartBtn) {
            return;
        }

        const pluginInstance = window.PluginManager.getPluginInstanceFromElement(addToCartBtn, 'AddToCart');

        if (!pluginInstance) {
            return;
        }

        pluginInstance.$emitter.subscribe('AddToCartPlugin/afterAdd', this.renderCartValue.bind(this));
    }

    renderCartValue(event) {
        console.log('Event AddToCartPlugin/afterAdd was fired!', event.detail);

        const cartValueElement = this.el.querySelector('.shopping-cart-value');

        const badgeTemplate = `
            <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">1</span>
        `;

        cartValueElement.innerText = event.detail;
        this.el.insertAdjacentHTML('afterbegin', badgeTemplate);
    }

    async openOffCanvasCart(event) {
        event.preventDefault();

        const existingOffCanvas = document.querySelector('#offcanvas');

        if (existingOffCanvas) {
            existingOffCanvas.remove();
        }

        const offCanvasTemplate = `
            <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvas" aria-labelledby="offcanvasLabel">
                <div class="offcanvas-header border-bottom">
                    <h5 class="offcanvas-title" id="offcanvasLabel">Shopping cart</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div class="offcanvas-body">
                    <p class="placeholder-glow">
                        <span class="placeholder col-6"></span>
                        <span class="placeholder w-75"></span>
                        <span class="placeholder" style="width: 25%;"></span>
                    </p>
                    <p class="placeholder-glow">
                        <span class="placeholder col-6"></span>
                        <span class="placeholder w-75"></span>
                        <span class="placeholder" style="width: 35%;"></span>
                    </p>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', offCanvasTemplate);

        const bsOffcanvas = new bootstrap.Offcanvas('#offcanvas');

        bsOffcanvas.show();

        await throttle(1000);

        this.renderOffCanvasCartContent()
    }

    renderOffCanvasCartContent() {
        const productName = document.querySelector('.product-name')?.innerText;
        const pricePrice = document.querySelector('.product-price')?.innerText;
        const priceSmgSrc = document.querySelector('img')?.getAttribute('src');
        const offCanvasBody = document.querySelector('.offcanvas-body');

        if (!productName || !pricePrice || !priceSmgSrc) {
            offCanvasBody.innerHTML = `
                <div class="alert alert-info" role="alert">No items in the cart</div>
            `;
            return;
        }

        offCanvasBody.innerHTML = `
             <div class="row">
                <div class="col-3">
                    <img alt="Chair" style="height: 75px;" class="img-fluid img-thumbnail rounded" src="${priceSmgSrc}">
                </div>
                <div class="col-9">
                    <div class="d-flex justify-content-between align-items-center">
                        <h6>${productName}</h6>
                        <button style="width: 30px; height: 30px;" class="btn-close"></button>
                    </div>

                    <div>${pricePrice}</div>
                </div>
            </div>
        `;
    }
}