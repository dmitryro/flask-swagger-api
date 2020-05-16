import client from '@services/client'

export default {
    getSites(data: object): Promise<any> {
        // Get all sites
        var sites = client.all('sites');
        return sites;
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
