import client from '@services/client'

function revert(node, old) {
    node.childNodes[7].innerHTML=old;
    return false;
}

export default {
 
    getLogs(data: object): Promise<any> {
        // Get all logs
        var logs = client.all('logs');
        return logs;
    },

    createLog(data: object): Promise<any> {
        // Post a new log
        var logs = client.post('logs', data || {});
        return logs;
    },

    modifyLog(data: object): Promise<any> {
        // Modify a log
        return [];
    },

    deleteLog(id: number): Promise<any> {
        var logs = client.delete('logs', id);
        return logs;
    },

    getLog(id: number): Promise<any> { 
        var logs = client.get('logs', id);
        return logs;
    }
}
