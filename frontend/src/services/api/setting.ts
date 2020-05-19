import client from '@services/client'

function revert(node, old) {
    alert("OLD"+old);
    node.childNodes[7].innerHTML=old;
    return false;
}

export default {
 
    getSettings(data: object): Promise<any> {
        // Get all settings
        var settings = client.all('settings');
        return settings;
    },

    crawlSetting(id: number): Promise<any> {
       var forms = client.get('crawl', id);
       return forms;
    },

    createSetting(data: object): Promise<any> {
        // Post a new setting
        var settings = client.post('settings', data || {});
        return settings;
    },

    modifySetting(data: object): Promise<any> {
        // Modify a setting
        return [];
    },

    deleteSetting(id: number): Promise<any> {
        var settings = client.delete('settings', id);
        return settings;
    }
}
