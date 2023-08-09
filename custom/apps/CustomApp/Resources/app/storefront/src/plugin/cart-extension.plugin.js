const CartPlugin = (await import(/* webpackChunkName: "cart.plugin" */ 'src/plugin/cart.plugin')).default;

export default class CartExtensionPlugin extends CartPlugin {
    init() {
        super.init();
    }

    renderOffCanvasCartContent() {
        super.renderOffCanvasCartContent();
        console.log('renderOffCanvasCartContent - override');
    }
}