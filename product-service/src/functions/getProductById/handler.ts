import "source-map-support/register"
import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/apiGateway"
import { formatJSONResponse } from "@libs/apiGateway"
import { middyfy } from "@libs/lambda"
import { mockProductList } from "../mockProductList.js"
import schema from "./schema"

const getProductById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    const { id } = event.pathParameters
    const product = mockProductList.find((p) => p.id === id)
    return formatJSONResponse(product)
  }

export const main = middyfy(getProductById)
