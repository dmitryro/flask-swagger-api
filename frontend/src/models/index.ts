import Site,{ISite} from './site'

interface IStore {
    site : ISite
}

class Store {

    siteStore:ISite
    name = 'abc'

    constructor(){
        this.siteStore=new Site()
    }
}
export default new Store()
export {IStore,ISite}
