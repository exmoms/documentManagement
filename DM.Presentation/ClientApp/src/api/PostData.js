/**
 * @file This file includes functions that help to post data to a specific API
 * @version 1.0
 */

/**
 * Post new document data.
 * Upload form-data, scanned copy of doc and attachments.
 * @author Youssef Shaaban <y.shaaban@lit-co.net>
 * @param {*} documentData
 * @param {*} images
 * @param {*} attachments
 * @param {*} url
 * @param {*} option its values either "Add" for add new document version or "Update" to update exsiting document Version
 */
export async function postDocumentData(
  documentData,
  scannedPages,
  attachments,
  url = "",
  option
) {
  var formData = new FormData();

  if (process.env.NODE_ENV === "development") {
    console.log(documentData);
    console.log(attachments);
    console.log(scannedPages);
  }

  switch (option) {
    case "Add":
      formData.append("Document", JSON.stringify(documentData));
      break;
    case "Update":
      formData.append("Version", JSON.stringify(documentData));
      break;
    default:
  }

  attachments.forEach((attachment) => {
    formData.append("Attachments", attachment);
  });
  scannedPages.forEach((scannedPage) => {
    formData.append("Scans", scannedPage);
  });

  let response = {};
  await fetch(url, {
    // content-type header should not be specified!
    method: "POST",
    headers: {
      Accept: "application/json",
      // "Content-Type": "application/json",
    },
    body: formData,
  }).then(
    (res) => {
      response = res;
      // response.json();
    },
    (error) => console.log("[ERROR]:", error)
  );
  return response;
}

/**
 * Post Attachment Data.
 * Upload attachment json data + attachment file  .
 * @author Ali Daghman <ali.daghman@lit-co.net>
 * @param {*} payload
 * @param {*} attachmentFile
 * @param {*} url
 */
export async function postAttachmentData(payload, attachmentFile, url = "") {
  var formData = new FormData();

  formData.append("Attachment", JSON.stringify(payload));
  formData.append("FileAttachment", attachmentFile);

  let response = {};
  await fetch(url, {
    // content-type header should not be specified!
    method: "POST",
    body: formData,
  }).then(
    (res) => {
      response = res;
      // response.json();
    },
    (error) => console.log("[ERROR]:", error)
  );
  return response;
}

/**
 * Post Request To API
 * Send post request to api with  payload  and return a response.
 * @author Ali Daghman <ali.daghman@lit-co.net>
 * @param {*} url The api url
 * @param {*} payload js object which will be sent as request body.
 */
export async function postDataToAPI(url, payload = null, method = "POST") {

  const response = await fetch(url, {
    method: method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  return response;
}
