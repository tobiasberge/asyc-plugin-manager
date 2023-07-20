import PluginManager from 'src/plugin-system/plugin.manager';
import ColorBoxPlugin from "src/plugin/color-box.plugin";

console.log('storefront main.js');

document.querySelector('.btn-test').addEventListener('click', async (event) => {
    event.preventDefault();

    document.querySelector('#placeholder').innerHTML = `
        <div class="card mb-3" data-async-fun="true">
            <div class="card-body">
                <h5 class="card-title">Async JS-plugin</h5>
                <ul>
                    <li>The selector <code>[data-async-fun]</code> was now added by JavaScript.</li>
                    <li><code>PluginManager.initializePlugins()</code> was executed after the HTML was injected.</li>
                    <li>The plugin <code>AsyncFun</code> was registered with <code>registerAsync</code>.</li>
                    <li>Because selector <code>[data-async-fun]</code> was found in the DOM the JS-plugin is fetched async during the initialization.</li>
                </ul>
            </div>
        </div>
    `;

    PluginManager.initializePlugins();
});

PluginManager.register('ColorBoxPlugin', ColorBoxPlugin, '[data-color-box]');
PluginManager.registerAsync('AsyncFun', 'async-fun.plugin', '[data-async-fun]');

document.addEventListener('DOMContentLoaded', () => PluginManager.initializePlugins(), false);
