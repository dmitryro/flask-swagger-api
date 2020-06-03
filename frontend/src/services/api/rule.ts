import client from '@services/client'

function revert(node, old) {
    node.childNodes[7].innerHTML=old;
    return false;
}

export default {
 
    getRules(data: object): Promise<any> {
        // Get all rules
        var rules = client.all('rules');
        return rules;
    },

    createRule(data: object): Promise<any> {
        // Post a new rule
        var rules = client.post('rules', data || {});
        return rules;
    },

    modifyRule(data: object): Promise<any> {
        // Modify a rule
        return [];
    },

    deleteRule(id: number): Promise<any> {
        var rules = client.delete('rules', id);
        return rules;
    }
}
