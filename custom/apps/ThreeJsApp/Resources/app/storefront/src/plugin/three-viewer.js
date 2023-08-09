import Plugin from 'src/plugin-system/plugin.class';

export default class Three extends Plugin {
    init() {
        console.log('ThreeJsPlugin - init()', this.el);

        this.el.classList.add('position-relative');

        this.el.insertAdjacentHTML('beforeend', '<button class="btn btn-primary opacity-75 position-absolute bottom-0 end-0 m-3"><i class="bi bi-box-fill me-1"></i> Open 3D viewer</button>');
    }
}