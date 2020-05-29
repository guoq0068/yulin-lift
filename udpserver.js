const dgram = require('dgram');
const server = dgram.createSocket('udp4');
const { ByteReader } = require('./Network');
const { Vector3, Quaternion } = require('./UnityClasses');

server.on('close',()=>{
    console.log('socket connected');
});

server.on('error',(err)=>{
    console.log(err);
});

server.on('listening',()=>{
    console.log("listening");
});


server.on('message',(msg,rinfo)=>{
    //console.log(`receive message from ${rinfo.address}:${rinfo.port}`);
    //console.log(Date.now());
    if(msg.length < 20) {
        console.log(Buffer.from(msg).toString("utf8"));
        server.send('begin',2222,rinfo.address);
    }
    else {
        //console.log(msg);
        const byteReader = new ByteReader(msg);
        const borderno = byteReader.readByte();
        const id = byteReader.readByte();
        const quaternion = byteReader.readArdunio();
        //console.log(Date.now() + " ,id" + id);
        console.log(Date.now() +",borderNo " + borderno + " ,id " + id + "," + quaternion.w + "," + quaternion.x + "," + quaternion.y + "," + quaternion.z );
    
    }
    
    
    
    //server.send('exit',rinfo.port,rinfo.address)
});

server.bind('3333');
//server.send('exit',2222,"192.168.3.33");
