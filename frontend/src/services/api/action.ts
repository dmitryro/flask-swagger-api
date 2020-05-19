import client from '@services/client'

function revert(node, old) {
    alert("OLD"+old);
    node.childNodes[7].innerHTML=old;
    return false;
}

export default {
 
    getActions(data: object): Promise<any> {
        // Get all actions
        var actions = client.all('actions');
        return actions;
    },

    crawlAction(id: number): Promise<any> {
       var forms = client.get('crawl', id);
       return forms;
    },

    createAction(data: object): Promise<any> {
        // Post a new action
        var actions = client.post('actions', data || {});
        return actions;
    },

    modifyAction(data: object): Promise<any> {
        // Modify a action
        return [];
    },

    deleteAction(id: number): Promise<any> {
        var actions = client.delete('actions', id);
        return actions;
    }
}
