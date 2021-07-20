export const formatJSONResponse = (response, statusCode) => {
  return {
    statusCode,
    body: JSON.stringify(response),
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  }
}
