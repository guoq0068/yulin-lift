var str = "AABBCC";

str = str + "00"

var buf = Buffer.from(str, 'hex');

var sum  = 0;
for(var i=0; i<buf.length - 1 ; i++) {
    sum += buf[i];
}

console.log(sum & 0xff);

buf[i] = sum & 0xff;

console.log(buf);

console.log(buf.toString('hex'));

