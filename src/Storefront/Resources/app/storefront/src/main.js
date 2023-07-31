import PluginManager from 'src/plugin-system/plugin.manager';
import ColorBoxPlugin from "src/plugin/color-box.plugin";

console.log('storefront - main.js');

const testButton = document.querySelector('.btn-test');

if (testButton) {
    testButton.addEventListener('click', async (event) => {
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
}

PluginManager.register('ColorBoxPlugin', ColorBoxPlugin, '[data-color-box]');
PluginManager.registerAsync('AsyncFun', 'plugin/async-fun.plugin', '[data-async-fun]');
PluginManager.registerAsync('AddToCart', 'plugin/add-to-cart.plugin', '[data-add-to-cart]');
PluginManager.registerAsync('DescriptionLoader', 'plugin/description-loader.plugin', '[data-description-loader]');
PluginManager.registerAsync('QuantitySelect', 'plugin/quantity-select.plugin', '[data-quantity-select]');
PluginManager.registerAsync('Cart', 'plugin/cart.plugin', '[data-cart]');
PluginManager.registerAsync('SearchSuggest', 'plugin/search-suggest.plugin', '[data-search-suggest]');

document.addEventListener('DOMContentLoaded', () => PluginManager.initializePlugins(), false);
