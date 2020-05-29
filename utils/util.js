function StringToHex(bytes) {   //string转hex
    var uint8Array = new Uint8Array(bytes.length / 2);
    var buff = new Uint8Array(bytes.length);
    var hexABC = "0123456789ABCDEF";
    var hexabc = "0123456789abcdef";

    var i, j = 0;
    var point = 0;
    for (i = 0; i < bytes.length; i++) {
        buff[i] = bytes[i] & 0xff;

        for (j = 0; j < 16; j++) {
            if (buff[i] == hexABC.charCodeAt(j)) {
                buff[i] = j;
                break;
            }
            else if (buff[i] == hexabc.charCodeAt(j)) {
                buff[i] = j;
                break;
            }
            if (j == 15) {
                buff[i] = 0;
            }//超过f的字符都视为0
        }
    }
    for (i = 0; i < bytes.length / 2; i++) {
        uint8Array[i] = buff[point] * 16 + buff[point + 1];
        point += 2;
    }
    return uint8Array;
}



function HexToString(bytes) {    //hex转string
    var ResultBuf = [];
    var len = 0;
    var hexlist = '0123456789abcdef';
    for (i = 0; i < bytes.length; i++) {

        ResultBuf[len] = hexlist.charCodeAt(bytes[i] / 16); len++;
        ResultBuf[len] = hexlist.charCodeAt(bytes[i] % 16); len++;

    }
    for (i = 0; i < len; i++) {
        bytes[i] = ResultBuf[i];
    }

    return bytes;
}

function StringToByte(bytes, needCheckSum) {    //hex转string
    bytes = bytes.replace(/ /g, '')
    console.log(bytes);
    var uint8Array = new Uint8Array(bytes.length / 2);
    var buff = new Uint8Array(bytes.length);
    var hexABC = "0123456789ABCDEF";
    var hexabc = "0123456789abcdef";

    var i, j = 0;
    var point = 0;
    var sum = 0x0;
    for (i = 0; i < bytes.length; i++) {
        buff[i] = bytes[i];

        for (j = 0; j < 16; j++) {
            if (bytes[i] == hexABC.charAt(j)) {
                buff[i] = j;
                break;
            }
            else if (bytes[i] == hexabc.charAt(j)) {
                buff[i] = j;
                break;
            }
            if (j == 15) {
                buff[i] = 0;
            }//超过f的字符都视为0

            
        }
    }
    for (i = 0; i < bytes.length / 2; i++) {
        uint8Array[i] = buff[point] * 16 + buff[point + 1];
        point += 2;
    }
    return uint8Array;
}


function addCheckSum(buf) {
    var newBuf = Buffer.alloc(buf.length + 1)
    var sum = 0x0;
    for(var i =0 ; i< buf.length ; i++) {
        newBuf[i] = buf[i];
        sum += buf[i];
    }

    newBuf[buf.length] = sum & 0xff;

    return newBuf;
}

/*
    根据指令，获取添加了校验码的16进制buf
 */
function StringToCrcHex(str) {
    var buf = null;
    if(str) {
        str = str + "00";
        buf = Buffer.from(str, 'hex');
        var sum = 0;
        for(var i=0; i<buf.length - 1; i++) {
            sum += buf[i];
        }

        buf[i] = sum & 0xff;
        console.log(buf);
    }
    return buf;
}

module.exports = {
    StringToHex,
    HexToString,
    StringToByte,
    addCheckSum,
    StringToCrcHex
};
