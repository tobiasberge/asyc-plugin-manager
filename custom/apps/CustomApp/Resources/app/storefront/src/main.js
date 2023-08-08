console.log('CustomApp - main.js');

/**
 * TODO:
 * - Register async plugin inside an app
 * - Override another async plugin inside an app
 * - What happens when my async plugin uses a library from node_modules?
 * - Better paths for registerAsync (anonymous function with import?)
 */

window.PluginManager.register('TextRenderer', () => import('./plugin/text-renderer.plugin'), '[data-text-renderer]');

window.PluginManager.override('ColorBox', () => import('./plugin/my-color-box.plugin'), '[data-color-box]');