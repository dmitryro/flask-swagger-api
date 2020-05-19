import client from '@services/client'

function revert(node, old) {
    node.childNodes[7].innerHTML=old;
    return false;
}

export default {
 
    getChains(data: object): Promise<any> {
        // Get all chains
        var chains = client.all('chains');
        return chains;
    },

    crawlChain(id: number): Promise<any> {
       var forms = client.get('crawl', id);
       return forms;
    },

    createChain(data: object): Promise<any> {
        // Post a new chain
        var chains = client.post('chains', data || {});
        return chains;
    },

    modifyChain(data: object): Promise<any> {
        // Modify a chain
        return [];
    },

    deleteChain(id: number): Promise<any> {
        var chains = client.delete('chains', id);
        return chains;
    }
}
