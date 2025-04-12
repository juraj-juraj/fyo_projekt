import "./konva.js";

export class Model{
    /**
     * 
     * @param {Konva.stage} stage 
     * @param {Number} height 
     * @param {Number} width 
     */
    constructor(stage, height, width){

        /** @type {Konva.Layer} */
        this.layer = new Konva.Layer();
        stage.add(this.layer);
        this.group = new Konva.Group({
            draggable: true,
            x: 0,
            y: 0,
        });
        this.layer.add(this.group);

        this.draw = this.draw.bind(this);
        this.addElement = this.addElement.bind(this);
        this.batchElements = this.batchElements.bind(this);
    }

    /**
     * 
     * @param {} element 
     */
    addElement(element) {
        this.group.add(element);
    }

    /**
     * 
     * @param {Array} elements 
     */
    batchElements(elements){
        this.group.add(...elements);
    }

    draw(){
        this.layer.batchDraw();
    }
}

/**
 * 
 * @param {Array} raySegments
 */
export function drawRay(raySegments){
    const buffer = [];
    for(let i = 0; i < (raySegments.length - 1); i++){
        const start_ray = raySegments[i]
        const end_ray = raySegments[i + 1]
        // Draw the ray from start_ray to end_ray
        const line = new Konva.Line({
            points: [start_ray.x, start_ray.y, end_ray.x, end_ray.y],
            stroke: 'blue',
            strokeWidth: 2,
        });
        buffer.push(line);
    }
    return buffer;
}
