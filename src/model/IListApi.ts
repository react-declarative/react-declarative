export interface IListApi {
    reload: (keepPagination?: boolean) => Promise<void>;
}

export default IListApi;
