import {observable} from 'mobx';
  
export default class SiteModel {
        store;
        id;
        @observable host;
        @observable port;
        @observable ga;
        @observable ip;
        @observable completed;

        constructor(store, id, host, port, ga, completed) {
                this.store = store;
                this.id = id;
                this.host = host;
                this.port = port;
                this.ip = '127.0.0.1';
                this.completed = completed;
        }

        toggle() {
                this.completed = !this.completed;
        }

        destroy() {
                this.store.todos.remove(this);
        }

        setHost(host) {
            this.host = host;
        }

        setPort(port) {
            this.port = port;
        }

        setGa(ga) {
            this.ga = ga;
        }

        setIp(ip) {
             this.ip = ip;
        }

        toJS() {
                return {
                        id: this.id,
                        host: this.host,
                        port: this.port,
                        ga: this.ga,
                        completed: this.completed
                };
        }

        static fromJS(store, object) {
                return new SiteModel(store, object.id, object.host, object.port, object.ga, object.completed);
        }
}
