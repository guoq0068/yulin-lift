const MessageType = {
    AssignID: 0,
    //add by guoq-s
    AdjustAimAngle: 1,
    MessageString: 2,
    //add by guoq-e
    ClientRequestObjectSync: 10,
    ServerRequestObjectSync: 11,
    ServerRequestObjectSyncComplete: 12,
    Instantiate: 20,
    Destroy: 21,
    DestroyNetworkObjects: 22,
    SyncTransform: 30,
    HeartBeat: 0x99,
    Response: 0xaa
};

module.exports = MessageType;