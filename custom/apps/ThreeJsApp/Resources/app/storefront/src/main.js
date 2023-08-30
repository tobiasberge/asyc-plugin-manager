console.log('ThreeJsApp - main.js');

window.PluginManager.register('ThreeViewer', () => import('./plugin/three-viewer'), '[data-three-viewer]');