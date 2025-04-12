import "./konva.js";
import { BeamPoint, OpticalElementInfo, OpticalElementType } from "./rayCalculator.js";

export class Model{
    /**
     * 
     * @param {Konva.stage} stage 
     * @param {Number} height 
     * @param {Number} width 
     */
    constructor(stage){

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
        this.drawRay = this.drawRay.bind(this);
        this.drawLenses = this.drawLenses.bind(this);
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


    /**
     * 
     * @param {BeamPoint[]} raySegments
     */
    drawRay(raySegments){
        for(let i = 0; i < (raySegments.length - 1); i++){
            const start_ray = raySegments[i]
            const end_ray = raySegments[i + 1]
            // Draw the ray from start_ray to end_ray
            const line = new Konva.Line({
                points: [start_ray.x, start_ray.y, end_ray.x, end_ray.y],
                stroke: 'blue',
                strokeWidth: 1,
            });
            this.group.add(line);
        }
    }

    /**
     * 
     * @param {OpticalElementInfo[]} lenses_info 
     * @param {BeamPoint[]} rays 
     * @param {Image} convexImage 
     * @param {Image} concaveImage 
     */
    drawLenses(lenses_info, rays, convexImage, concaveImage){
        const enlarge_lens = 1.4;
        for(let i = 0; i < lenses_info.length; i++){
            if (lenses_info[i].type === OpticalElementType.LENS_CONVEX || lenses_info[i].type === OpticalElementType.LENS_CONCAVE){
                const lens_size = Math.abs(rays[i].y) * 2 * enlarge_lens;
                const image = lenses_info[i].type === OpticalElementType.LENS_CONVEX ? convexImage : concaveImage;
                const lensImage = new Konva.Image({
                    x: lenses_info[i].position - lens_size/4,
                    y: (-1)* lens_size/2,
                    image: image,
                    width: lens_size/2 ,
                    height: lens_size,
                });
                this.group.add(lensImage);
            }
        }
    }

    draw(){
        const groupBox = this.group.getClientRect(); 

        this.group.scale({ x: this.layer.width() / groupBox.width * 0.7, y:this.layer.height() / groupBox.height *0.7 });
        this.group.y(this.layer.height() / 2);
        this.layer.draw();
    }
}
