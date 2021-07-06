import { formatJSONResponse } from "@libs/apiGateway"
import { middyfy } from "@libs/middleware"
import { mockProductList } from "@functions/mockProductList.js"

const handler = async (event) => {
  const { id } = event.pathParameters
  const product = mockProductList.find((p) => p.id === id)
  return formatJSONResponse(product)
}

export const getProductById = middyfy(handler)
