console.log('CustomApp - main.js');

/**
 * TODO:
 * - Register async plugin inside an app
 * - Override another async plugin inside an app
 * - What happens when my async plugin uses a library from node_modules?
 */

window.PluginManager.register('TextRenderer', () => import('./plugin/text-renderer.plugin'), '[data-text-renderer]');


window.PluginManager.override('ColorBox', () => import('./plugin/my-color-box.plugin'), '[data-color-box]');
window.PluginManager.override('Cart', () => import('./plugin/cart-extension.plugin'), '[data-cart]');