const Cursor = require('./Cursor');
const { Vector3, Quaternion } = require('../UnityClasses');
const { floatSize, intSize } = require('../typeSize');

class ByteReader extends Cursor {
    readInt() {
        const value = this.dataSource.readInt32LE(this.cursor);
        this.cursor += intSize;

        return value;
    }

    readVector3() {
        const x = this.dataSource.readFloatLE(this.cursor + (floatSize * 0));
        const y = this.dataSource.readFloatLE(this.cursor + (floatSize * 1));
        const z = this.dataSource.readFloatLE(this.cursor + (floatSize * 2));
        this.cursor += floatSize * 3;
        
        return new Vector3(x, y, z);
    }

    readQuaternion() {
        const x = this.dataSource.readFloatLE(this.cursor + (floatSize * 0)) / 16384.0;
        const y = this.dataSource.readFloatLE(this.cursor + (floatSize * 1)) / 16384.0;
        const z = this.dataSource.readFloatLE(this.cursor + (floatSize * 2)) / 16384.0;
        const w = this.dataSource.readFloatLE(this.cursor + (floatSize * 3)) / 16384.0;
        this.cursor += floatSize * 4;
        
        return new Quaternion(x, y, z, w);
    }

    readArdunio() {
        var q = new Quaternion();
        //var temp;
        //const packet = this.dataSource + this.cursor ;
        q.w = this.dataSource.readInt16BE(this.cursor) / 16384.0;
        q.x = this.dataSource.readInt16BE(this.cursor + 4) / 16384.0;
        q.y = this.dataSource.readInt16BE(this.cursor + 8) / 16384.0;
        q.z = this.dataSource.readInt16BE(this.cursor + 12) / 16384.0;
        /*
        console.log(packet);
        temp = ((packet[0] << 8) | packet[1]);
        
        q.w =  temp/16384.0;
        temp = ((packet[4] << 8) | packet[5]);
        q.x = temp/16384.0;
        temp = ((packet[8] << 8) | packet[9]);
        q.y = temp/16384.0;
        temp = ((packet[12] << 8) | packet[13]);
        q.z = temp/16384.0;  */
        return q;
    }

    readByte() {
        const value = this.dataSource[this.cursor];
        this.cursor++;

        return value;
    }

    readOrignStr() {
        var result = this.dataSource.toString();
        return result;
    }
}

module.exports = ByteReader;