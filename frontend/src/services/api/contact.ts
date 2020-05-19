import client from '@services/client'

function revert(node, old) {
    alert("OLD"+old);
    node.childNodes[7].innerHTML=old;
    return false;
}

export default {
 
    getContacts(data: object): Promise<any> {
        // Get all contacts
        var contacts = client.all('contacts');
        return contacts;
    },

    crawlContact(id: number): Promise<any> {
       var forms = client.get('crawl', id);
       return forms;
    },

    createContact(data: object): Promise<any> {
        // Post a new contact
        var contacts = client.post('contacts', data || {});
        return contacts;
    },

    modifyContact(data: object): Promise<any> {
        // Modify a contact
        return [];
    },

    deleteContact(id: number): Promise<any> {
        var contacts = client.delete('contacts', id);
        return contacts;
    }
}
