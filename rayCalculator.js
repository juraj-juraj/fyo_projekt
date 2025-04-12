
export class BeamPoint{
    /**
     * @param {number} x
     * @param {math.matrix} ray
     */
    constructor(x, ray){
        /** @type {number} */
        this.x = x;
        /** @type {number} */
        this.y = ray.subset(math.index(0,0));
        /** @type {math.matrix} */
        this.ray = ray;
    }
    /** 
     * @param {number} dx
     * @param {number} dy
     */
    movePoint(dx, dy){
        this.x += dx;
        this.y += dy;
    }
    
    /**
     * @returns {math.matrix} - Ray vector
     */
    getRay(){
        return this.ray;
    }
};

export class OpticalSystem{
    /**
     * @param {array} elements - Array of elements defining Optical system, in order how are they stacked
     */
    constructor(elements){
        /** @type {array} */
        this.elements = elements;
    }

    /**
     * @param {number} index
     * @returns {math.matrix} - Matrix at index
     */
    at(index){
        return this.elements.at(index);
    }

    /**
     * 
     * @returns {Number}
     */
    len(){
        return this.elements.length();
    }
    /**
     * @param {number} index
     */
    update(index, matrix){
        if(index < 0){
            index = this.elements.length() + index;
        }
        this.elements[index] = matrix;
    }

    /**
     * @param {math.matrix} input
     * @returns {array} - Array of BeamPoint objects
     * @description Marches the ray through the optical system
     */
    marchRay(input){
        let x_pos = 0;
        let buffer = [new BeamPoint(x_pos, input)];

        for(let index in this.elements){
            x_pos += this.elements[index].subset(math.index(0,1));
            let temp = math.multiply(this.elements[index], buffer.at(-1).getRay());
            buffer.push(new BeamPoint(x_pos, temp));
        }
        return buffer;
    }

    /**
     * @description - Exports the parameters and positions of the lenses in the system
     */
    exportLenses(){
        const buffer = [];
        let position = 0;
        for(let index in this.elements){
            if(this.elements[index].subset(math.index(1,0)) === 0){
                const length = this.elements[index].subset(math.index(0,1));
                buffer.push(new OpticalElementInfo(OpticalElementType.ENVIRONMENT, position, length));
            }
            else{
                const focal_length = (-1)/this.elements[index].subset(math.index(1,0));
                const type = focal_length > 0 ? OpticalElementType.LENS_CONVEX : OpticalElementType.LENS_CONCAVE;
                buffer.push(new OpticalElementInfo(type, position, focal_length));
            }
            position += this.elements[index].subset(math.index(0,1));
        }
        return buffer;
    }
};

export const OpticalElementType = Object.freeze({
    LENS_CONCAVE: "lens_concave",
    LENS_CONVEX: "lens_convex",
    ENVIRONMENT: "environment",
    MIRROR: "mirror"
});

export class OpticalElementInfo{
    /**
     * 
     * @param {OpticalElementType} type 
     * @param {number} position 
     * @param {number} length - If environment, length of the element, if lens, focal length
     */
    constructor(type, position, length){
        /** @type {OpticalElementType} */
        this.type = type;
        /** @type {number} */
        this.position = position;
        /** @type {number} */
        this.length = length;
    }
}


export function createEnvMatrix(length) {
    return math.matrix([[1, length], [0, 1]]);
};
export function createLensMatrix(focal_length){
    const power = 1/focal_length;
    return math.matrix([[1, 0], [(-1) * power, 1]]);
};
export function createInput(y, angle){
    return math.matrix([[y], [angle]]);
};
/**
 * 
 * @param {BeamPoint} point 
 * @returns {BeamPoint}
 */
export function computeFocusPoint(point){
    const ray = point.getRay();
    const x = (-1) * ray.subset(math.index(0,0)) / ray.subset(math.index(1,0)); 
    return new BeamPoint(x + point.x, math.matrix([[0], [ ray.subset(math.index(1,0)) ]]));
}

/**
 * 
 * @param {BeamPoint} input 
 * @param {OpticalSystem} system 
 */
export function marchRayToFocus(input, system){
    const buffer = system.marchRay(input);
    buffer.push(computeFocusPoint(buffer.at(-1)));
    return buffer;
}


