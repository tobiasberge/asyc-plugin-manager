console.log('my-color-box.plugin', window.PluginManager.getPlugin('ColorBox').get('class'));

const ColorBoxPlugin = (await import('src/plugin/color-box.plugin')).default;

console.log('ColorBoxPlugin', ColorBoxPlugin);

export default class MyColorBoxPlugin extends ColorBoxPlugin {
    init() {
        super.init();
        console.log('We have overwritten the ColorBox plugin!');

        this.addAdditionalBox();
    }

    getTemplate() {
        return `<p>This text was added by an app which overrides the <code>ColorBox</code> plugin.</p>`;
    }

    addAdditionalBox() {
        this.el.insertAdjacentHTML('beforeend', this.getTemplate());
    }
}