export class SceneModel{
    constructor(){
        this.elements = [];
        this.addElement = this.addElement.bind(this);
        this.transform = this.transform.bind(this);
    }

    addElement(element) {
        this.elements.push(element);
    }

    /**
     * 
     * @param {math.matrix} transformation 
     */
    transform(transformation) {
        this.elements = this.elements.map(element => {
            return element.transform(transformation);
        });
    }
}