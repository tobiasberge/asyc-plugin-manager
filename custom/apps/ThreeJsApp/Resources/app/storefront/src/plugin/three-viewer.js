export default class Three extends window.PluginBaseClass {
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

    async onViewerButtonClick(event) {
        // const THREE = await import(/* webpackChunkName: "three-js-vendor" */ 'three');
        //
        // const scene = new THREE.Scene();
        // const camera = new THREE.PerspectiveCamera( 75, this.el.offsetWidth / this.el.offsetHeight, 0.1, 1000 );
        //
        // const renderer = new THREE.WebGLRenderer();
        // renderer.setSize( this.el.offsetWidth, this.el.offsetHeight );
        //
        // this.el.querySelector('img').replaceWith(renderer.domElement);
        //
        // const geometry = new THREE.BoxGeometry(2, 2, 2);
        // const material = new THREE.MeshBasicMaterial( { color: 0xff00000 } );
        // const cube = new THREE.Mesh( geometry, material );
        // scene.add(cube);
        //
        // camera.position.z = 5;
        //
        // function animate() {
        //     requestAnimationFrame( animate );
        //
        //     cube.rotation.x += 0.01;
        //     cube.rotation.y += 0.01;
        //
        //     renderer.render( scene, camera );
        // }
        //
        // animate();
    }
}