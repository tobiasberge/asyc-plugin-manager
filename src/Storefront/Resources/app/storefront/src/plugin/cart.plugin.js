import Plugin from 'src/plugin-system/plugin.class';

export default class CartPlugin extends Plugin {
    init() {
        console.log('CartPlugin init');

        const addToCartBtn = document.querySelector('[data-add-to-cart]');

        console.log('addToCartBtn', addToCartBtn);

        const pluginInstance = window.PluginManager.getPluginInstanceFromElement(addToCartBtn, 'AddToCart');

        console.log('pluginInstance', pluginInstance);

        if (!pluginInstance) {
            return;
        }

        pluginInstance.$emitter.subscribe('AddToCartPlugin/afterAdd', () => {
            console.log('Event AddToCartPlugin/afterAdd was fired!');
        });
    }
}