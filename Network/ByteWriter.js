const Cursor = require('./Cursor');
const { Vector3, Quaternion, AdjustAngle } = require('../UnityClasses');
const { floatSize, intSize } = require('../typeSize');

class ByteWriter extends Cursor {
    /**
     * Write Int32
     * @param {int} value 
     */
    writeInt(value) {
        this.dataSource.writeInt32LE(value, this.cursor);
        this.cursor += intSize;
    }

    /**
     * Write Vector3
     * @param {Vector3} value
     */
    writeVector3(value) {
        this.dataSource.writeFloatLE(value.x, this.cursor + (floatSize * 0));
        this.dataSource.writeFloatLE(value.y, this.cursor + (floatSize * 1));
        this.dataSource.writeFloatLE(value.z, this.cursor + (floatSize * 2));
        this.cursor += floatSize * 3;
    }

    /**
     * Write Quaternion
     * @param {Quaternion} value 
     */
    writeQuaternion(value) {
        this.dataSource.writeFloatLE(value.x, this.cursor + (floatSize * 0));
        this.dataSource.writeFloatLE(value.y, this.cursor + (floatSize * 1));
        this.dataSource.writeFloatLE(value.z, this.cursor + (floatSize * 2));
        this.dataSource.writeFloatLE(value.w, this.cursor + (floatSize * 3));
        this.cursor += floatSize * 4;
    }

    //add by guoq-s
    /**
     * 
     * @param {*} value 
     */
    writeAdjustAngle(value) {
        console.log(value);
        this.dataSource.writeFloatLE(value.x, this.cursor + (floatSize * 0));
        this.dataSource.writeFloatLE(value.y, this.cursor + (floatSize * 1));
        this.dataSource.writeUInt8(value.type, this.cursor + (floatSize * 2));
        this.cursor += floatSize * 2 + 1;
    }
    //add by guoq-e

    /**
     * Write Byte
     * @param {byte} value 
     */
    writeByte(value) {
        this.dataSource[this.cursor] = value;
        this.cursor++;
    }
}

module.exports = ByteWriter;