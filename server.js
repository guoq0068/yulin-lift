const net = require('net');
const SocketManager = require('./SocketManager');
const { ByteReader } = require('./Network');
const { broadcast } = require('./utils/socket');
const MessageType = require('./enums/MessageType');

const {
    sendClientID,
    synchronizeNetworkObjects,
    destroyNetworkObjects,
    parseInstantiate,
    parseSyncTransform,
    sendAdjustAngle,
    sendString
} = require('./handleMessage');

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

    //add guoq-s
    setTimeout(sendAdjustTimeLoop, 200, socket);
    //add guoq-e
    // Send Client ID to client
    sendClientID(socket);

    socket.on('data', function(data) {
	    console.log('data' + data);
        const byteReader = new ByteReader(data);
        const messageType = byteReader.readByte();
        const clientID = byteReader.readInt();
        
        if(messageType !== MessageType.SyncTransform) {
            console.log(`Receive Message\nMessageType: ${messageType}\nClientID: ${clientID}`);        
        }

        // Dispatch Message
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
        }
    });

    socket.on('end', function() {
        console.log(`Client ${socket.clientID} Left.`);
        destroyNetworkObjects(socket);
        SocketManager.removeSocket(socket);
    });

    socket.on('error', function(err) {
        console.log('Error', err);

        if(err.code === 'ECONNRESET') {
            socket.emit('end');
        }
    });
});

console.log(Date.now());
server.listen(3333, () => console.log('Node.js TCP Server for Unity Multiplayer listening on port 3333...'));
