import "./konva.js";
import { BeamPoint, OpticalElementInfo, OpticalElementType } from "./rayCalculator.js";

const LINE_WIDTH = 0.6;

export class Model{
    /**
     * 
     * @param {Konva.stage} stage 
     */
    constructor(stage){

        /** @type {Konva.Layer} */
        this.layer = new Konva.Layer();
        stage.add(this.layer);

        this.group = new Konva.Group({
            draggable: true,
            x: 0,
            y: 0,
            dragBoundFunc: function (pos) {
                return {
                  x: pos.x,
                  y: this.y(),
                };
              },
        });
        this.layer.add(this.group);

        this.draw = this.draw.bind(this);
        this.addElement = this.addElement.bind(this);
        this.batchElements = this.batchElements.bind(this);
        this.drawRay = this.drawRay.bind(this);
        this.drawLenses = this.drawLenses.bind(this);
        this.clear = this.clear.bind(this);
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
                strokeWidth: LINE_WIDTH,
            });
            this.group.add(line);
            line.zIndex(4);
        }
    }

    /**
     * 
     * @param {OpticalElementInfo[]} lenses_info 
     * @param {BeamPoint[]} rays 
     * @param {Image} convexImage 
     * @param {Image} concaveImage 
     * @param {Image} eyeImage 
     * @param {boolean} drawEye 
     */
    drawLenses(lenses_info, rays, convexImage, concaveImage, eyeImage, drawEye = true){
        const enlarge_lens = 1.4;
        for(let i = 0; i < lenses_info.length; i++){
            if (i === lenses_info.length - 1 && drawEye){
                const eye_size = computeEyeSize(rays[i].y);
                const eye = new Konva.Image({
                    x: lenses_info[i].position - eye_size.height/3.8,
                    y: (-1)* eye_size.height/2,
                    image: eyeImage,
                    width: eye_size.width,
                    height: eye_size.height,
                });
                this.group.add(eye);
                eye.zIndex(2);
                continue;
            }
            if (lenses_info[i].type == OpticalElementType.LENS_CONVEX || lenses_info[i].type == OpticalElementType.LENS_CONCAVE){
                const lens_size = Math.abs(rays[i].y) * 2 * enlarge_lens;
                const image = lenses_info[i].type == OpticalElementType.LENS_CONVEX ? convexImage : concaveImage;
                const lensImage = new Konva.Image({
                    x: lenses_info[i].position - lens_size/4,
                    y: (-1)* lens_size/2,
                    image: image,
                    width: lens_size/2 ,
                    height: lens_size,
                });
                this.group.add(lensImage);
                lensImage.zIndex(2);
            }
        }
    }

    drawOpticalAxis(){
        const groupBox = this.group.getClientRect(); 

        const opticalAxis = new Konva.Line({
            points: [0, 0, groupBox.width*1.2, 0],
            stroke: 'black',
            strokeWidth: LINE_WIDTH,
            dash: [10, 5],
            lineCap: 'round',
        });
        this.group.add(opticalAxis);
        opticalAxis.zIndex(3);
    }

    drawBoundingBox(){
        const groupBox = this.group.getClientRect();
        const boundingBox = new Konva.Rect({
            x: 0,
            y: (-1) * groupBox.height / 2,
            width: groupBox.width,
            height: groupBox.height,
            fill: 'white',
        });
        this.group.add(boundingBox);
        boundingBox.zIndex(0);
    }

    draw(){
        this.drawOpticalAxis();
        this.drawBoundingBox();

        const groupBox = this.group.getClientRect();
        const scaleRatio = this.layer.height() / groupBox.height * 0.7;
        this.group.scale({ x: scaleRatio, y:scaleRatio });
        this.group.y(this.layer.height() / 2);
        this.layer.draw();
    }

    clear(){
        this.group.destroyChildren();
        this.group.scale({ x: 1, y: 1 });
    }
}

/**
 * 
 * @param {Number} pupilRadius 
 * @returns {Number}
 * @description - Computes the eye size based on the pupil radius
 */
export function computeEyeSize(pupilRadius){
    const eyeSize = Math.abs(pupilRadius) * 2 * 3;
    return {height: eyeSize, width: eyeSize * 1.12};
}
