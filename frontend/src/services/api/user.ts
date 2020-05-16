import client from '@services/client'

export default {
    getUsers(data: object): Promise<any> {
         var users = client.all('users');
         return users;
    },

    createUser(data: object): Promise<any> {
        var users = client.post('users', data || {});
        return users;
    },

    modifyUser(data: object): Promise<any> {
        var users = [];
        return users;
    },

    deleteUser(id: number): Promise<any> {
        var users = client.delete('users', id);
        return users;
    }
}
