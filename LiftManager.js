const m_liftsMap = new Map();

m_liftsMap.set("601939262728", {name:"大连市星海家园8号楼1号电梯", status: 0, floors:{min:0, max:30}});
m_liftsMap.set("601929262729", {name:"大连市星海家园9号楼1号电梯", status: 0,floors:{min:0, max:8}});

/**
 * Get Sockets
 * @return {net.Socket[]}
 */
function getLifts() {
    var results = []
    m_liftsMap.forEach((value, key) => {
        results.push({id:key, ...value})
    })
    return results;
}


function getLiftByid(id) {
    var item = m_liftsMap.get(id);
    return item;
}
/**
 * Add Socket
 * @param {net.Socket} socket 
 */
function setLiftStatus(data) {
    var itemdata = m_liftsMap.get(data.id);
    
    if(itemdata) {

        itemdata.socketid = data.socketid;
        itemdata.status  = 1;
        itemdata.updateTime = data.updateTime;

        m_liftsMap.set(data.id, itemdata);

        itemdata.id = data.id;
    }
    return itemdata;
}

function updateLiftStatus(data) {
    var itemdata;


    for(var value of m_liftsMap) {
        itemdata = value[1];
        if(itemdata.socketid == data.socketid) {
            itemdata.id = value[0];
            if(data.status == 0) {
                itemdata.status = 0;
            }
            else {
                itemdata.status = 1;
            }
            itemdata.updateTime = Date.now();
            break;
        }
    }

    return itemdata;

}

function checkStatus() {
    var nowtime = Date.now();
    var datas = [];
    for(var value of m_liftsMap) {
        var itemdata = value[1];
        var key = value[0];
        if(itemdata.status == 1) {
            if(nowtime - itemdata.updateTime > 120 * 1000) {
                itemdata.status = 0;
                itemdata.updateTime = nowtime;
                m_liftsMap.set(key, itemdata);
                itemdata.id = key;
                datas.push(itemdata);
            }
        }
    }
    return datas;
}


module.exports = {
    getLifts,
    setLiftStatus,
    updateLiftStatus,
    checkStatus,
    getLiftByid
};