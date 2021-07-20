import { formatJSONResponse } from "@libs/apiGateway"
import { middyfy } from "@libs/middleware"
import { getMockProductList } from "@functions/getMockProductList.js"

const handler = async (event) => {
  try {
    const { id } = event.pathParameters
    const mockDbResponse = await getMockProductList()
    const product = mockDbResponse.find((p) => p.id === id)
    return product
      ? formatJSONResponse(product, 200)
      : formatJSONResponse(null, 404)
  } catch (error) {
    return formatJSONResponse(null, 500)
  }
}

export const getProductById = middyfy(handler)
