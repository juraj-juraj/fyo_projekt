
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
        ;
    }
};

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

export function prepareSystem(matrices){
    matrices.reverse();
    return matrices.reduce((acc, matrix) => math.multiply(acc, matrix), math.identity(2));
}

export function stepCompute(input, system_matrices){
    let buffer = [input];
    for(let index in system_matrices){
        console.log("matrix: ", system_matrices[index]);
        console.log("input: ", buffer.at(-1));
        let temp = math.multiply(system_matrices[index], buffer.at(-1));
        console.log("results: ", temp);
        buffer.push(temp);
    }
    return buffer;
}


