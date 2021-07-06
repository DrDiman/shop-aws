import "source-map-support/register"
import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/apiGateway"
import { formatJSONResponse } from "@libs/apiGateway"
import { middyfy } from "@libs/lambda"
import { mockProductList } from "../mockProductList.js"
import schema from "./schema"

const getProductsList: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    return formatJSONResponse(mockProductList)
  }

export const main = middyfy(getProductsList)
