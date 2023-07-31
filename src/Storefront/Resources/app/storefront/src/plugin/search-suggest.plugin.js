import Plugin from "src/plugin-system/plugin.class";

export default class QuantitySelectPlugin extends Plugin {

    static options = {
        timeoutMs: 700
    }

    init() {
        this.initPopover();

        this.el.addEventListener('keyup', this.delay(this.onKeyUp.bind(this), this.options.timeoutMs));
    }

    delay(fn, ms) {
        let timer = 0
        return function(...args) {
            clearTimeout(timer)
            timer = setTimeout(fn.bind(this, ...args), ms || 0);
        }
    }

    initPopover() {
        this.popoverInstance = new bootstrap.Popover(this.el, {
            placement: 'bottom',
            sanitize: false,
            html: true,
            customClass: 'search-suggest-popover',
            trigger: 'manaual'
        });

        this.popoverInstance.setContent({
            '.popover-body': this.getLoaderTemplate()
        });

        this.popoverInstance.enable();
    }

    getLoaderTemplate() {
        return `
            <p class="placeholder-glow mb-0" style="width: 450px;">
                <span class="placeholder w-100 mb-3"></span>
                <span class="placeholder w-100 mb-3"></span>
                <span class="placeholder w-75 mb-3"></span>
                <span class="placeholder w-100 mb-3"></span>
            </p>
        `;
    }

    getProductsTemplate() {
        return `
            <ul class="list-group list-group-flush" style="width: 450px; margin: -0.5rem;">
                <a href="#" class="list-group-item list-group-item-action">A first product</a>
                <a href="#" class="list-group-item list-group-item-action">A second product</a>
                <a href="#" class="list-group-item list-group-item-action">A third product</a>
                <a href="#" class="list-group-item list-group-item-action">A fourth product</a>
            </ul>
        `
    }

    async onKeyUp(event) {
        this.popoverInstance.setContent({
            '.popover-body': this.getProductsTemplate()
        });
    }
}