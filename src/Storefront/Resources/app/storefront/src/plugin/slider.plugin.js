import Plugin from 'src/plugin-system/plugin.class';
import { tns } from 'tiny-slider';

export default class SliderPlugin extends Plugin {
    init() {
        console.log('slider', tns);

        const slider = tns({
            container: '[data-slider]',
            items: 1,
            // autoplay: true,
            controlsText: ['<i class="bi bi-chevron-left"></i>', '<i class="bi bi-chevron-right"></i>'],
            autoplayButton: false,
            loop: false,
            arrowKeys: true,
        });
    }
}