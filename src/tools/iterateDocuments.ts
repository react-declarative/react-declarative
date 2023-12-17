import IRowData, { RowId } from "../model/IRowData";

import sleep from "../utils/sleep";

const TOTAL_DOCUMENTS = 10_000;
const REQUEST_LIMIT = 5_000;
const REQUEST_DELAY = 100;

interface IConfig<Data extends IRowData = IRowData> {
  totalDocuments?: number;
  limit?: number;
  delay?: number;
  createRequest: (data: {
    limit: number,
    lastId: RowId | null
  } & Omit<IConfig<Data>, 'createRequest'>) => (Data[] | Promise<Data[]>);
}

export const iterateDocuments = async function* <Data extends IRowData = IRowData>({
  totalDocuments = TOTAL_DOCUMENTS,
  limit = REQUEST_LIMIT,
  delay = REQUEST_DELAY,
  createRequest = () => [],
}: IConfig<Data>) {

  const request: typeof createRequest = async (...args) => {
    const [result] = await Promise.all([
      createRequest(...args),
      sleep(delay),
    ]);
    return result;
  };

  let counter = 0;
  let lastId = null;
  let lastQuery = request({
    lastId: null,
    limit,
  });

  while (counter < totalDocuments) {
    const response = await lastQuery;
    for (const document of response) {
      yield document as unknown as Data;
    }
    if (response.length < limit) {
      break;
    }
    lastId = response[response.length - 1].id || null;
    lastQuery = request({
      lastId,
      limit,
    });
    counter += response.length;
  }

};

export default iterateDocuments;
