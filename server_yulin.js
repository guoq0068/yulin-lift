const net = require('net');
const SocketManager = require('./SocketManager');
const { ByteReader } = require('./Network');
const { broadcast } = require('./utils/socket');
const MessageType = require('./enums/MessageType');
const util = require('./utils/util');
const liftManager = require('./LiftManager');
var qr = require('qr-image');

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var wssocketlist= [];
var funcInterval = setInterval(heartBitFun, 60*1000);

function heartBitFun() {
    //console.log("heartBitfun is called");
    var datas = liftManager.checkStatus();
    if(datas.length > 0) {
        wssocketlist.forEach(wssocket => {
            wssocket.emit('remove_lift', datas);
        })
    }
}

console.log(liftManager.getLifts());

const {
    sendClientID,
    synchronizeNetworkObjects,
    destroyNetworkObjects,
    parseInstantiate,
    parseSyncTransform,
    sendAdjustAngle,
    sendString
} = require('./handleMessage');


io.on('connection', function(socket){
    console.log('a user connected');
    
    wssocketlist.push(socket);
    console.log("emit end");
    socket.on('login', (data)=> {
        console.log("login data" + data);
        socket.emit('add_lift',liftManager.getLifts());
    });
    socket.on('send_cmd', (data) => {
        console.log(data);
        var lift = liftManager.getLiftByid(data.id)
        if(lift) {
            var socket = SocketManager.getSocketByName(lift.socketid);
            if(socket) {
                var buffer = util.StringToCrcHex(data.cmd);
                console.log(buffer);
                socket.write(buffer);

            }
        }
        /*
        var sockets = SocketManager.getSockets();
        sockets.forEach(socket=>{
            console.log(socket.clientID);
            if(socket.clientID == data.clientid) {
            }
        }) */
    });

    socket.on('disconnect', function () {
        var newsocklist = []
        wssocketlist.forEach(wssocket => {
            if(wssocket.id != socket.id) {
                newsocklist.push(wssocket);
            }
        })
        wssocketlist = newsocklist;
        console.log('disconnected');
  
    });

});


app.get('/qr', function(req,res){
    
    var qrstr = req.query.text;
    if(!qrstr) {
        qrstr = "welcome"
    }
    var buffer = util.StringToCrcHex(qrstr);

    var code = qr.image(buffer.toString('hex').toUpperCase(), { type: 'png', size: 12, margin: 2});
    res.setHeader('Content-type', 'image/png');  //sent qr image to client side
    code.pipe(res);
  });

http.listen(9001, function(){
    console.log('listening on *:9001');
});

let socketCounter = 0;    // This value will use for distinguish client for each transmission

//add by guoq-s
function sendAdjustTimeLoop(socket) {
    sendAdjustAngle(socket);
    sendString(socket);
    
    setTimeout(sendAdjustTimeLoop, 200, socket);
}
//add by guoq-e

const server = net.createServer(function(socket) {
    socket.name = socket.remoteAddress + ":" + socket.remotePort;
    socket.clientID = socketCounter++;
    socket.syncCount = 0;   // Check for Sync Network Object Instantiation


    SocketManager.addSocket(socket);
    console.log('New Client Connected: ' + socket.name);
    console.log('Assigned ID: ' + socket.clientID);

    // Send Client ID to client
    sendClientID(socket);

    socket.on('data', function(data) {
	    console.log(data);
        const byteReader = new ByteReader(data);
        const messageType = byteReader.readByte();
        
        var datas = [];
        if(messageType == MessageType.HeartBeat) {
            //心跳包
            console.log(`Receive Message\nMessageType: ${messageType}\n`);  
            itemdata = liftManager.updateLiftStatus({socketid: socket.name})      
            datas.push(itemdata);
            wssocketlist.forEach(wssocket => {
                wssocket.emit('add_lift', datas);
            })             
        }
        else if(messageType == MessageType.Response) {
            console.log(`Receive Response Message`);  
        }
        else {
            //登录消息 id
            var clientid = byteReader.readOrignStr();
            var itemdata;
            
            console.log(clientid);
            if(clientid.indexOf('login') >= 0) {
                clientid = clientid.substring(5);
                console.log(clientid);
            }
            itemdata = liftManager.setLiftStatus({
                id: clientid,
                socketid: socket.name,
                updateTime : Date.now()
            })
            datas.push(itemdata);
            wssocketlist.forEach(wssocket => {
                wssocket.emit('add_lift', datas);
            })           
        }

        // Dispatch Message
        /*
        switch(messageType) {
            case MessageType.ClientRequestObjectSync:
                synchronizeNetworkObjects(socket);
                break;
            case MessageType.Instantiate:
                parseInstantiate(socket, data);
                break;
            case MessageType.SyncTransform:
                parseSyncTransform(socket, data);
                break;
            default:
                console.log('Invalid Message Type!');
                return;
        }*/
    });

    socket.on('end', function() {
        var datas = [];
        var itemdata = liftManager.updateLiftStatus({socketid: socket.name,status: 0})  
        SocketManager.removeSocket(socket);
        datas.push(itemdata);
        wssocketlist.forEach(wssocket => {
            wssocket.emit('remove_lift', datas);
        })        
    });

    socket.on('error', function(err) {
        console.log('Error', err);

        if(err.code === 'ECONNRESET') {
            socket.emit('end');
        }
    });
});

server.listen(9002, () => console.log('Node.js TCP Server for Unity Multiplayer listening on port 9002...'));
