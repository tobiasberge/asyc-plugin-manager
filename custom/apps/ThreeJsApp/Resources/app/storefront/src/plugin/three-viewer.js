import Plugin from 'src/plugin-system/plugin.class';

export default class Three extends Plugin {
    static options = {
        viewerButtonText: 'Open 3D viewer',
        viewerButtonClass: 'three-viewer-open'
    }

    init() {
        console.log('ThreeJsPlugin - init()', this.el);

        this.appendViewerButton();
        this.registerEvents();
    }

    appendViewerButton() {
        const template = `
            <button class="${this.options.viewerButtonClass} btn btn-primary opacity-75 position-absolute bottom-0 end-0 m-3"><i class="bi bi-box-fill me-1"></i> 
                ${this.options.viewerButtonText}
            </button>
        `;

        this.el.classList.add('position-relative');
        this.el.insertAdjacentHTML('beforeend', template);
    }

    registerEvents() {
        const viewerButton = this.el.querySelector(`.${this.options.viewerButtonClass}`);

        viewerButton.addEventListener('click', this.onViewerButtonClick.bind(this));
    }

    onViewerButtonClick(event) {
        console.log('onViewerButtonClick', event);
    }
}