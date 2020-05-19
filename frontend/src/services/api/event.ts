import client from '@services/client'

function revert(node, old) {
    alert("OLD"+old);
    node.childNodes[7].innerHTML=old;
    return false;
}

export default {
 
    getEvents(data: object): Promise<any> {
        // Get all events
        var events = client.all('events');
        return events;
    },

    crawlEvent(id: number): Promise<any> {
       var forms = client.get('crawl', id);
       return forms;
    },

    createEvent(data: object): Promise<any> {
        // Post a new event
        var events = client.post('events', data || {});
        return events;
    },

    modifyEvent(data: object): Promise<any> {
        // Modify a event
        return [];
    },

    deleteEvent(id: number): Promise<any> {
        var events = client.delete('events', id);
        return events;
    }
}
