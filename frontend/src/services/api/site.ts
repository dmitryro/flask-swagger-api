import client from '@services/client'

function revert(node, old) {
    node.childNodes[7].innerHTML=old;
    return false;
}

export default {
 
    getSites(data: object): Promise<any> {
        // Get all sites
        var sites = client.all('sites');
        return sites;
    },

    crawlSite(id: number): Promise<any> {
       var forms = client.get('crawl', id);
       return forms;
    },

    createSite(data: object): Promise<any> {
        // Post a new site
        var sites = client.post('sites', data || {});
        return sites;
    },

    modifySite(data: object): Promise<any> {
        // Modify a site
        return [];
    },

    deleteSite(id: number): Promise<any> {
        var sites = client.delete('sites', id);
        return sites;
    }
}
