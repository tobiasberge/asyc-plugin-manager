import Plugin from "src/plugin-system/plugin.class";

export default class AsyncFunPlugin extends Plugin {
    init() {
        this.el.insertAdjacentHTML('beforeend', `
            <div class="card-footer text-muted">
                This footer was added by the <code>AsyncFunPlugin</code>
            </div>
        `);
    }
}