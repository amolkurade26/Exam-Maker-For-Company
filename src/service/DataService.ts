import { ServiceKey, ServiceScope } from "@microsoft/sp-core-library";
import { PageContext } from "@microsoft/sp-page-context";
import { spfi, SPFI, SPFx as spSPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/attachments";
import "@pnp/sp/items";
import "@pnp/sp/site-groups/web";
import "@pnp/sp/batching";
import "@pnp/sp/items/get-all";
import "@pnp/sp/fields";
import "@pnp/sp/sputilities";
import { IEmailProperties } from "@pnp/sp/sputilities";
import { IItem, IItems } from "@pnp/sp/items";
interface IDataService {
    _sp: SPFI;
    getListData(listName: string, columns?: string, expand?: string, filter?: string): Promise<any[]>;
    getListDataById(listName: string, id: number): Promise<any>;
    updateBulkData(listName: string, data: any[]): Promise<any>;
    createData(listName: string, data: any[]): Promise<any[]>;
    getMultipleListData(listName: string[]): Promise<any[]>;    
}

let parent: DataService;

export default class DataService implements IDataService {
    public static readonly serviceKey: ServiceKey<IDataService> = ServiceKey.create<IDataService>('ds', DataService);
    _sp: SPFI;

    constructor(serviceScope: ServiceScope) {
        serviceScope.whenFinished(() => {
            const pageContext = serviceScope.consume(PageContext.serviceKey);

            this._sp = spfi().using(spSPFx({
                pageContext
            }));
        });
        parent = this;
    }

    public getListData(listName: string, columns?: string, expand?: string, filter?: string): Promise<any[]> {

        let _items: IItems = this._sp.web.lists.getByTitle(listName).items;

        if (expand) {
            _items = _items.expand(expand);
        }
        if (columns) {
            _items = _items.select(columns);
        }
        if (filter) {
            _items = _items.filter(filter);
        }

        return new Promise<any>((resolve) => {
            return _items.getAll().then(data => {
                resolve(data);
            });
        });
    }

    public getListDataById(listName: string, id: number): Promise<any> {
        return new Promise((resolve) => {
            return this._sp.web.lists.getByTitle(listName).items.select().expand().filter(`ID eq ${id}`).getAll().then(data => resolve(data))
        })
    }

    public async createData(listName: string, data: any[]): Promise<any[]> {
        const [batchedSP, execute] = this._sp.batched();
        const list = batchedSP.web.lists.getByTitle(listName);
        let res: any[] = [];
        data.map(d => {
            list.items.add(d).then(b => {
                console.log(b);
                res.push(b);
            });
        })

        // Executes the batched calls
        return new Promise<any[]>(async (resolve) => {
            await execute();
            resolve(res)
        });
    }

    public async updateBulkData(listName: string, data: any[]): Promise<any> {
        const [batchedSP, execute] = this._sp.batched();
        const list = batchedSP.web.lists.getByTitle(listName);

        data.map(d => {
            list.items.getById(d.Id).update(d).then(b => {
                console.log(b);
            });
        })

        // Executes the batched calls
        await execute();
    }

    public getMultipleListData(listName: string[]): Promise<any[]> {
        const httpReqArray = new Array();

        listName.map(l => {
            httpReqArray.push(this._sp.web.lists.getByTitle(l).items.getAll());
        })

        return new Promise<any[]>(async (resolve) => await Promise.all(httpReqArray).then(dataArr => {
            resolve(dataArr);
        }));
    }
}