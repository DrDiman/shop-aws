import { StatusCode } from "@enums/StatusCode"

const defaultHeaders = {
  "Access-Control-Allow-Origin": "*",
}

const successResponse = (response, statusCode = StatusCode.SUCCESS) => ({
  statusCode,
  body: JSON.stringify(response),
  headers: defaultHeaders,
})

const errorResponse = (
  statusCode = StatusCode.SERVER_ERROR,
  response = null,
) => ({
  statusCode,
  body: JSON.stringify(response),
  headers: defaultHeaders,
})

export { errorResponse, successResponse }
