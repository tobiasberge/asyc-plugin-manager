import Plugin from "src/plugin-system/plugin.class";

export default class QuantitySelectPlugin extends Plugin {

    static options = {
        quantityInputSelector: '.product-quantity',
        plusSelector: '.plus',
        minusSelector: '.minus'
    }

    init() {
        this.quantityInputEl = this.el.querySelector(this.options.quantityInputSelector);
        this.plusEl = this.el.querySelector(this.options.plusSelector);
        this.minusEl = this.el.querySelector(this.options.minusSelector);

        this.registerEvents()
    }

    registerEvents() {
        this.plusEl.addEventListener('click', this.onClickPlus.bind(this));
        this.minusEl.addEventListener('click', this.onClickMinus.bind(this));
    }

    onClickPlus(event) {
        this.quantityInputEl.value = parseInt(this.quantityInputEl.value) + 1;
    }

    onClickMinus(event) {
        if (this.quantityInputEl.value <= 1) {
            alert('You cannot select less than 1 item.');
            return;
        }

        this.quantityInputEl.value = parseInt(this.quantityInputEl.value) - 1;
    }
}