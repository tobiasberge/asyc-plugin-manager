import Plugin from 'src/plugin-system/plugin.class';

export default class TextRendererPlugin extends Plugin {
    init() {
        this.el.innerHTML = 'This text was rendered by a JS-plugin from the CustomApp!';
    }
}