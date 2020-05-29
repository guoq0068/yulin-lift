const byteSize = 1;
const floatSize = 4;
const intSize = 4;
const vector3Size = floatSize * 3;
const quaternionSize = floatSize * 4;
//add by guoq-s
const adjustAngleSize = floatSize * 2 + byteSize;
//add by guoq-e

module.exports = {
    byteSize,
    floatSize,
    intSize,
    vector3Size,
    quaternionSize,
    adjustAngleSize
};