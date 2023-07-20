import Plugin from "src/plugin-system/plugin.class";

export default class ColorBoxPlugin extends Plugin {
    init() {
        this.applyBgColor()
    }

    applyBgColor() {
        return this.el.style.backgroundColor = this.getRandomColor()
    }

    getRandomColor() {
        const letters = '0123456789ABCDEF'
        let color = '#'

        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)]
        }

        return color
    }
}