console.log('ThreeJsApp - main.js');

window.PluginManager.register('ThreeViewer', () => import(/* webpackChunkName: "three-viewer.plugin" */ './plugin/three-viewer'), '[data-three-viewer]');