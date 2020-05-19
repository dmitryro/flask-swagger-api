import client from '@services/client'

function revert(node, old) {
    alert("OLD"+old);
    node.childNodes[7].innerHTML=old;
    return false;
}

export default {
 
    getAnalytics(data: object): Promise<any> {
        // Get all analytics
        var analytics = client.all('analytics');
        return analytics;
    },

    crawlAnalytic(id: number): Promise<any> {
       var forms = client.get('crawl', id);
       return forms;
    },

    createAnalytic(data: object): Promise<any> {
        // Post a new analytic
        var analytics = client.post('analytics', data || {});
        return analytics;
    },

    modifyAnalytic(data: object): Promise<any> {
        // Modify a analytic
        return [];
    },

    deleteAnalytic(id: number): Promise<any> {
        var analytics = client.delete('analytics', id);
        return analytics;
    }
}
