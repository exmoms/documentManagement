/**
 * @file this file includes functions that fetch data from API
 */

// Generic Delete Method
export async function deleteFromApi(url) {
  let res = await fetch(url, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  return res;
}

// Get MetaData Models
export async function fetchData(url) {
  let object = {};
  /*
   * send the request through a CORS proxy
   * https://stackoverflow.com/questions/43262121/trying-to-use-fetch-and-pass-in-mode-no-cors/43268098#43268098
   */
  await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then(
      (data) => (object = data),
      (error) => console.log(error)
    );
  return object;
}
