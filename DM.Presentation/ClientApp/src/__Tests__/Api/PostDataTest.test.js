import { postAttachmentData, postDocumentData, postDataToAPI } from "../../api/PostData";
import { act } from "react-dom/test-utils";
import FakeXMLHttpRequest from "fake-xml-http-request";
import { cleanup } from "@testing-library/react";
afterEach(cleanup);
describe("PostData Components", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("post data from server when server returns a successful response for postAttachmentData", (done) => {
    // 1
   let logMock= jest.spyOn(console, "log");
    const mockSuccessResponse = {};
    const mockJsonPromise = Promise.resolve(mockSuccessResponse); // 2
    const mockFetchPromise = Promise.resolve({
      // 3
      json: () => mockJsonPromise,
    });
    jest.spyOn(global, "fetch").mockImplementation(() => mockFetchPromise);
    //arguments for postAttachmentData
    let payload="payload"
    let attachments = ["attachment 1", "attachment 2"];
    let url = "anyTestedURL/testedUrl";

    // expected callled value for fetch method
    var formData = new FormData();
    formData.append("Attachment", JSON.stringify(payload));
    formData.append("FileAttachment", attachments);
    const fetchedData = postAttachmentData(
      payload,
      attachments,
      url
    );
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(url, {
      method: "POST",
      body: formData,
    });
    process.nextTick(() => {
      // 6
      expect(fetchedData).toEqual(mockJsonPromise);
    });
    global.fetch.mockClear(); // 7
    done();
  });
  it("post data from server when server returns a successful response for postDocumentData component when option=Add", (done) => {
    // 1
    const mockSuccessResponse = {};
    const mockJsonPromise = Promise.resolve(mockSuccessResponse); // 2
    const mockFetchPromise = Promise.resolve({
      // 3
      json: () => mockJsonPromise,
    });
    jest.spyOn(global, "fetch").mockImplementation(() => mockFetchPromise);
    //arguments for postDocumentData
    let documentData = ["document 1", "document 2"];
    let scannedPages = ["page 1", "page 2"];
    let attachments = ["attachment 1", "attachment 2"];
    let url = "anyTestedURL/testedUrl";
    let option = "Add";
    // expected callled value for fetch method
    var formData = new FormData();
    formData.append("Document", JSON.stringify(documentData));
    attachments.forEach((attachment) => {
      formData.append("Attachments", attachment);
    });
    scannedPages.forEach((scannedPage) => {
      formData.append("Scans", scannedPage);
    });
    const fetchedData = postDocumentData(
      documentData,
      scannedPages,
      attachments,
      url,
      option
    );
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: formData,
    });
    process.nextTick(() => {
      // 6
      expect(fetchedData).toEqual(mockJsonPromise);
    });
    global.fetch.mockClear(); // 7
    done();
  });

  it("post data from server when server returns a successful response for postDocumentData component when option=Update", (done) => {
    // 1
    const mockSuccessResponse = {};
    const mockJsonPromise = Promise.resolve(mockSuccessResponse); // 2
    const mockFetchPromise = Promise.resolve({
      // 3
      json: () => mockJsonPromise,
    });
    jest.spyOn(global, "fetch").mockImplementation(() => mockFetchPromise);
    //arguments for postDocumentData
    let documentData = ["document 1", "document 2"];
    let scannedPages = ["page 1", "page 2"];
    let attachments = ["attachment 1", "attachment 2"];
    let url = "anyTestedURL/testedUrl";
    let option = "Update";
    // expected callled value for fetch method
    var formData = new FormData();
    formData.append("Version", JSON.stringify(documentData));
    attachments.forEach((attachment) => {
      formData.append("Attachments", attachment);
    });
    scannedPages.forEach((scannedPage) => {
      formData.append("Scans", scannedPage);
    });
    const fetchedData = postDocumentData(
      documentData,
      scannedPages,
      attachments,
      url,
      option
    );
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: formData,
    });
    process.nextTick(() => {
      // 6
      expect(fetchedData).toEqual(mockJsonPromise);
    });
    global.fetch.mockClear(); // 7
    done();
  });

  it("post data from server when server returns a successful response for postDocumentData component when option=default", (done) => {
    // 1
    const mockSuccessResponse = {};
    const mockJsonPromise = Promise.resolve(mockSuccessResponse); // 2
    const mockFetchPromise = Promise.resolve({
      // 3
      json: () => mockJsonPromise,
    });
    jest.spyOn(global, "fetch").mockImplementation(() => mockFetchPromise);
    //arguments for postDocumentData
    let documentData = ["document 1", "document 2"];
    let scannedPages = ["page 1", "page 2"];
    let attachments = ["attachment 1", "attachment 2"];
    let url = "anyTestedURL/testedUrl";
    let option = "default";
    // expected callled value for fetch method
    var formData = new FormData();
    attachments.forEach((attachment) => {
      formData.append("Attachments", attachment);
    });
    scannedPages.forEach((scannedPage) => {
      formData.append("Scans", scannedPage);
    });
    const fetchedData = postDocumentData(
      documentData,
      scannedPages,
      attachments,
      url,
      option
    );
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: formData,
    });
    process.nextTick(() => {
      // 6
      expect(fetchedData).toEqual(mockJsonPromise);
    });
    global.fetch.mockClear(); // 7
    done();
  });

  it("post data from server when server returns a successful response for postDataToAPI component", (done) => {
    // 1
    const mockSuccessResponse = {};
    const mockJsonPromise = Promise.resolve(mockSuccessResponse); // 2
    const mockFetchPromise = Promise.resolve({
      // 3
      json: () => mockJsonPromise,
    });
    jest.spyOn(global, "fetch").mockImplementation(() => mockFetchPromise);
    let payload = null;
    let url = "anyTestedURL/testedUrl";
    const fetchedData = postDataToAPI(url);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    process.nextTick(() => {
      // 6
      expect(fetchedData).toEqual(mockJsonPromise);
    });
    global.fetch.mockClear(); // 7
    done();
  });
});
