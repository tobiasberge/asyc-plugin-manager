const ColorBoxPlugin = (await import(/* webpackChunkName: "color-box.plugin" */ 'src/plugin/color-box.plugin')).default;

export default class MyColorBoxPlugin extends ColorBoxPlugin {
    init() {
        super.init();

        this.addAdditionalBox();
    }

    getTemplate() {
        return `<p>This text was added by an app which overrides the <code>ColorBox</code> plugin.</p>`;
    }

    addAdditionalBox() {
        this.el.insertAdjacentHTML('beforeend', this.getTemplate());
    }
}