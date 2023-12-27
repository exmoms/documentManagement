import {
  deleteFromApi,fetchData
} from "../../api/FetchData";
import { cleanup } from "@testing-library/react";
afterEach(cleanup);
//test getDocumentClasses function component
describe("FetchData Components", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  //test deleteFromApi function component
  it("fetches data from server when server returns a successful response for deleteFromApi component", (done) => {
    let url="anyTestedUrl"
    const mockSuccessResponse = {};
    const mockJsonPromise = Promise.resolve(mockSuccessResponse); // 2
    const mockFetchPromise = Promise.resolve({
      // 3
      json: () => mockJsonPromise,
    });
    jest.spyOn(global, "fetch").mockImplementation(() => mockFetchPromise); //
    const fetchedData = deleteFromApi(url);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(url, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    process.nextTick(() => {
      // 6
      expect(fetchedData).toEqual(mockJsonPromise);
    });
    global.fetch.mockClear(); // 7
    done();
  });
 
  //test fetchData function component
  it("fetches data from server when server returns a successful response for fetchData component", (done) => {
    let url="anyTestedUrl"
    const mockSuccessResponse = {};
    const mockJsonPromise = Promise.resolve(mockSuccessResponse); // 2
    const mockFetchPromise = Promise.resolve({
      // 3
      json: () => mockJsonPromise,
    });
    jest.spyOn(global, "fetch").mockImplementation(() => mockFetchPromise); //
    const fetchedData = fetchData(url);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    process.nextTick(() => {
      // 6
      expect(fetchedData).toEqual(mockJsonPromise);
    });
    global.fetch.mockClear(); // 7
    done();
  });

});
