console.log('CustomApp - main.js');

/**
 * TODO:
 * - Register async plugin inside an app
 * - Override another async plugin inside an app
 * - What happens when my async plugin uses a library from node_modules?
 * - Better paths for registerAsync (anonymous function with import?)
 */

window.PluginManager.register('TextRenderer', () => import(/* webpackChunkName: "text-renderer.plugin" */ './plugin/text-renderer.plugin'), '[data-text-renderer]');

window.PluginManager.override('ColorBox', () => import(/* webpackChunkName: "my-color-box.plugin" */ './plugin/my-color-box.plugin'), '[data-color-box]');
window.PluginManager.override('Cart', () => import(/* webpackChunkName: "cart-extension.plugin" */ './plugin/cart-extension.plugin'), '[data-cart]');