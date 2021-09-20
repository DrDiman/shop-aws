import { StatusCode } from "@enums/StatusCode"

const defaultHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true,
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
