import deepmerge from 'deepmerge';
import PluginRegistry from 'src/plugin-system/plugin.registry';
import PluginBaseClass from 'src/plugin-system/plugin.class';
import DomAccess from 'src/helper/dom-access.helper';
import 'src/plugin-system/plugin.config.manager';
import Iterator from 'src/helper/iterator.helper';

class PluginManagerSingleton {

    constructor() {
        this._registry = new PluginRegistry();
    }

    /**
     * Registers a plugin to the plugin manager.
     *
     * @param {string} pluginName
     * @param {Plugin} pluginClass
     * @param {string|NodeList|HTMLElement} selector
     * @param {Object} options
     *
     * @returns {*}
     */
    register(pluginName, pluginClass, selector = document, options = {}) {
        if (this._registry.has(pluginName, selector)) {
            throw new Error(`Plugin "${pluginName}" is already registered.`);
        }

        return this._registry.set(pluginName, pluginClass, selector, options);
    }

    registerAsync(pluginName, pluginClassPath, selector = document, options = {}) {
        if (this._registry.has(pluginName, selector)) {
            throw new Error(`Plugin "${pluginName}" is already registered.`);
        }

        return this._registry.set(pluginName, pluginClassPath, selector, options, true);
    }

    /**
     * Removes a plugin from the plugin manager.
     *
     * @param {string} pluginName
     * @param {string} selector
     *
     * @returns {*}
     */
    deregister(pluginName, selector = document) {
        if (!this._registry.has(pluginName, selector)) {
            throw new Error(`The plugin "${pluginName}" is not registered.`);
        }

        return this._registry.delete(pluginName, selector);
    }

    /**
     * Extends an already existing plugin with a new class or function.
     * If both names are equal, the plugin will be overridden.
     *
     * @param {string} fromName
     * @param {string} newName
     * @param {Plugin} pluginClass
     * @param {string|NodeList|HTMLElement} selector
     * @param {Object} options
     *
     * @returns {boolean}
     */
    extend(fromName, newName, pluginClass, selector = document, options = {}) {
        // Register the plugin under a new name
        // If the name is the same, replace it
        if (fromName === newName) {
            this.deregister(fromName, selector);
            return this.register(newName, pluginClass, selector, options);
        }

        return this._extendPlugin(fromName, newName, pluginClass, selector, options);
    }

    /**
     * Returns a list of all registered plugins.
     *
     * @returns {*}
     */
    getPluginList() {
        return this._registry.keys();
    }

    /**
     * Returns the definition of a plugin.
     *
     * @param {string} pluginName
     * @param {boolean} strict
     *
     * @returns {Map|null}
     */
    getPlugin(pluginName, strict = true) {
        if (!pluginName) {
            throw new Error('A plugin name must be passed!');
        }

        if (!this._registry.has(pluginName)) {
            if (strict) {
                throw new Error(`The plugin "${pluginName}" is not registered. You might need to register it first.`);
            } else {
                this._registry.set(pluginName);
            }
        }

        return this._registry.get(pluginName);
    }

    /**
     * Returns all registered plugin instances for the passed plugin name.
     *
     * @param {string} pluginName
     * @returns {Map|null}
     */
    getPluginInstances(pluginName) {
        const plugin = this.getPlugin(pluginName);

        return plugin.get('instances');
    }

    /**
     * Returns the plugin instance from the passed element selected by plugin Name.
     *
     * @param {HTMLElement} el
     * @param {String} pluginName
     *
     * @returns {Object|null}
     */
    static getPluginInstanceFromElement(el, pluginName) {
        const instances = PluginManagerSingleton.getPluginInstancesFromElement(el);

        return instances.get(pluginName);
    }

    /**
     * Returns all plugin instances from the passed element.
     *
     * @param {HTMLElement} el
     *
     * @returns {Map|null}
     */
    static getPluginInstancesFromElement(el) {
        if (!DomAccess.isNode(el)) {
            throw new Error('Passed element is not an Html element!');
        }

        el.__plugins = el.__plugins || new Map();

        return el.__plugins;
    }

    /**
     * Initializes all plugins which are currently registered.
     */
    initializePlugins() {
        const initializationFailures = [];
        Iterator.iterate(this.getPluginList(), (plugin, pluginName) => {
            if (pluginName) {
                if (!this._registry.has(pluginName)) {
                    throw new Error(`The plugin "${pluginName}" is not registered.`);
                }

                const plugin = this._registry.get(pluginName);

                // Init all sync plugins
                if (plugin.has('registrations') && !plugin.has('async')) {
                    Iterator.iterate(plugin.get('registrations'), entry => {
                        try {
                            this._initializePlugin(plugin.get('class'), entry.selector, entry.options, plugin.get('name'));
                        } catch (failure) {
                            initializationFailures.push(failure);
                        }
                    });
                }

                // Init all async plugins
                if (plugin.has('registrations') && plugin.has('async')) {
                    Iterator.iterate(plugin.get('registrations'), (entry) => {
                        try {
                            this._initializePluginAsync(plugin.get('class'), entry.selector, entry.options, plugin.get('name'));
                        } catch (failure) {
                            initializationFailures.push(failure);
                        }
                    });
                }
            }
        });

        initializationFailures.forEach((failure) => {
            console.error(failure);
        })
    }

    /**
     * Initializes a single plugin.
     *
     * @param {Object} pluginName
     * @param {String|NodeList|HTMLElement} selector
     * @param {Object} options
     */
    initializePlugin(pluginName, selector, options) {
        let plugin;
        let pluginClass;
        let mergedOptions;

        if (this._registry.has(pluginName, selector)) {
            plugin = this._registry.get(pluginName, selector);
            const registrationOptions = plugin.get('registrations').get(selector);
            pluginClass = plugin.get('class');
            mergedOptions = deepmerge(pluginClass.options || {}, deepmerge(registrationOptions.options || {}, options || {}));
        } else {
            plugin = this._registry.get(pluginName);
            pluginClass = plugin.get('class');
            mergedOptions = deepmerge(pluginClass.options || {}, options || {});
        }

        this._initializePlugin(pluginClass, selector, mergedOptions, plugin.get('name'));
    }

    /**
     * Executes a vanilla plugin class.
     *
     * @param {Plugin} pluginClass
     * @param {String|NodeList|HTMLElement} selector
     * @param {Object} options
     * @param {string} pluginName
     */
    _initializePlugin(pluginClass, selector, options, pluginName = false) {
        if (DomAccess.isNode(selector)) {
            return PluginManagerSingleton._initializePluginOnElement(selector, pluginClass, options, pluginName);
        }

        if (typeof selector === 'string') {
            selector = PluginManagerSingleton._queryElements(selector);
        }

        return Iterator.iterate(selector, el => {
            PluginManagerSingleton._initializePluginOnElement(el, pluginClass, options, pluginName);
        });
    }

    async _initializePluginAsync(pluginClassPath, selector, options, pluginName = false) {
        let pluginClass;

        if (DomAccess.isNode(selector)) {
            // pluginClass = (await import(/* webpackChunkName: "[index].[request]" */ `../${pluginClassPath}`)).default;
            return PluginManagerSingleton._initializePluginOnElement(selector, pluginClass, options, pluginName);
        }

        if (typeof selector === 'string') {
            selector = PluginManagerSingleton._queryElements(selector);
        }

        if (selector.length > 0) {
            pluginClass = (await import(
                /* webpackChunkName: "[index].[request]" */
                /* webpackMode: "lazy" */
                `../plugin/${pluginClassPath}`
            )).default;
        }

        return Iterator.iterate(selector, el => {
            PluginManagerSingleton._initializePluginOnElement(el, pluginClass, options, pluginName);
        });
    }

    /**
     * Determines the way to query the elements.
     *
     * [data-*] => querySelectorAll
     * #fooBar => getElementById
     * #foo_bar => getElementById
     * #foo-bar => getElementById
     * #foo .bar => querySelectorAll
     * .fooBar => getElementsByClassName
     * .FOO => getElementsByClassName
     * .foo_bar => getElementsByClassName
     * .foo-bar => getElementsByClassName
     * .foo .bar => querySelectorAll
     *
     * FOO => getElementsByTagName
     * FOO .bar => querySelectorAll
     *
     * For performance reason used regex based on common characters `a-zA-Z1-9_-`
     * instead of the entire compatible characters
     *
     * @param {string} selector
     *
     * @return {NodeList|HTMLCollection|Array}
     */
    static _queryElements(selector) {
        if (selector.startsWith('.')) {
            const regexEl = /^\.([\w-]+)$/.exec(selector);
            if (regexEl) {
                return document.getElementsByClassName(regexEl[1]);
            }
        } else if (selector.startsWith('#')) {
            const regexEl = /^#([\w-]+)$/.exec(selector);
            if (regexEl) {
                const el = document.getElementById(regexEl[1]);

                return (el) ? [el] : [];
            }
        } else if (/^([\w-]+)$/.exec(selector)) {
            return document.getElementsByTagName(selector);
        }

        return document.querySelectorAll(selector);
    }

    /**
     * Executes a vanilla plugin class on the passed element.
     *
     * @param {Node|HTMLElement} el
     * @param {Plugin} pluginClass
     * @param {Object} options
     * @param {string} pluginName
     * @private
     */
    static _initializePluginOnElement(el, pluginClass, options, pluginName) {
        if (typeof pluginClass !== 'function') {
            throw new Error('The passed plugin is not a function or a class.');
        }

        const instance = PluginManager.getPluginInstanceFromElement(el, pluginName);
        if (!instance) {
            return new pluginClass(el, options, pluginName);
        }

        return instance._update();
    }

    /**
     * extends a plugin class with another class or function.
     *
     * @param {string} fromName
     * @param {string} newName
     * @param {Plugin} pluginClass
     * @param {string|NodeList|HTMLElement} selector
     * @param {Object} options
     *
     * @returns {*}
     * @private
     */
    _extendPlugin(fromName, newName, pluginClass, selector, options = {}) {
        if (!this._registry.has(fromName, selector)) {
            throw new Error(`The plugin "${fromName}" is not registered.`);
        }

        // get current plugin
        const extendFrom = this._registry.get(fromName);
        const parentPlugin = extendFrom.get('class');
        const mergedOptions = deepmerge(parentPlugin.options || {}, options || {});

        // Create plugin
        class InternallyExtendedPlugin extends parentPlugin {
        }

        // Extend the plugin with the new definitions
        InternallyExtendedPlugin.prototype = Object.assign(InternallyExtendedPlugin.prototype, pluginClass);
        InternallyExtendedPlugin.prototype.constructor = InternallyExtendedPlugin;

        return this.register(newName, InternallyExtendedPlugin, selector, mergedOptions);
    }

}

/**
 * Create the PluginManager instance.
 * @type {Readonly<PluginManagerSingleton>}
 */
export const PluginManagerInstance = Object.freeze(new PluginManagerSingleton());

export default class PluginManager {

    constructor() {
        window.PluginManager = this;
    }

    /**
     * Registers a plugin to the plugin manager.
     *
     * @param {string} pluginName
     * @param {Plugin} pluginClass
     * @param {string|NodeList|HTMLElement} selector
     * @param {Object} options
     *
     * @returns {*}
     */
    static register(pluginName, pluginClass, selector = document, options = {}) {
        return PluginManagerInstance.register(pluginName, pluginClass, selector, options);
    }

    static registerAsync(pluginName, pluginClassPath, selector = document, options = {}) {
        return PluginManagerInstance.registerAsync(pluginName, pluginClassPath, selector, options);
    }

    /**
     * Removes a plugin from the plugin manager.
     *
     * @param {string} pluginName
     * @param {string} selector
     *
     * @returns {*}
     */
    static deregister(pluginName, selector) {
        return PluginManagerInstance.deregister(pluginName, selector);
    }

    /**
     * Extends an already existing plugin with a new class or function.
     * If both names are equal, the plugin will be overridden.
     *
     * @param {string} fromName
     * @param {string} newName
     * @param {Plugin} pluginClass
     * @param {string|NodeList|HTMLElement} selector
     * @param {Object} options
     *
     * @returns {boolean}
     */
    static extend(fromName, newName, pluginClass, selector, options = {}) {
        return PluginManagerInstance.extend(fromName, newName, pluginClass, selector, options);
    }

    static override(overrideName, pluginClass, selector, options = {}) {
        return PluginManagerInstance.extend(overrideName, overrideName, pluginClass, selector, options);
    }

    /**
     * Returns a list of all registered plugins.
     *
     * @returns {*}
     */
    static getPluginList() {
        return PluginManagerInstance.getPluginList();
    }

    /**
     * Returns the definition of a plugin.
     *
     * @returns {*}
     */
    static getPlugin(pluginName) {
        return PluginManagerInstance.getPlugin(pluginName);
    }

    /**
     * Returns all registered plugin instances for the passed plugin name..
     *
     * @param {string} pluginName
     *
     * @returns {Map|null}
     */
    static getPluginInstances(pluginName) {
        return PluginManagerInstance.getPluginInstances(pluginName);
    }

    /**
     * Returns the plugin instance from the passed element selected by plugin Name.
     *
     * @param {HTMLElement} el
     * @param {String} pluginName
     *
     * @returns {Object|null}
     */
    static getPluginInstanceFromElement(el, pluginName) {
        return PluginManagerSingleton.getPluginInstanceFromElement(el, pluginName);
    }

    /**
     * Returns all plugin instances from the passed element.
     *
     * @param {HTMLElement} el
     *
     * @returns {Map|null}
     */
    static getPluginInstancesFromElement(el) {
        return PluginManagerSingleton.getPluginInstancesFromElement(el);
    }

    /**
     * Initializes all plugins which are currently registered.
     */
    static initializePlugins() {
        PluginManagerInstance.initializePlugins();
    }

    /**
     * Initializes a single plugin.
     *
     * @param {Object} pluginName
     * @param {String|NodeList|HTMLElement} selector
     * @param {Object} options
     */
    static initializePlugin(pluginName, selector, options) {
        PluginManagerInstance.initializePlugin(pluginName, selector, options);
    }
}

window.PluginManager = PluginManager;
window.PluginBaseClass = PluginBaseClass;
