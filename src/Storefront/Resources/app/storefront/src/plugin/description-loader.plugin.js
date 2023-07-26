import Plugin from "src/plugin-system/plugin.class";

export default class DescriptionLoaderPlugin extends Plugin {
    async init() {
        await this.renderDescription();
    }

    timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async renderDescription() {
        await this.timeout(2000);

        this.el.innerHTML = `
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, 
            sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem 
            ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore 
            magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata 
            sanctus est Lorem ipsum dolor sit amet.
        `;
    }
}