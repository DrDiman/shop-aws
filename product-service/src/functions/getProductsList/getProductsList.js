import { formatJSONResponse } from "@libs/apiGateway"
import { middyfy } from "@libs/middleware"
import { getMockProductList } from "@functions/getMockProductList.js"

const handler = async (event) => {
  try {
    const mockDbResponse = await getMockProductList()
    return mockDbResponse
      ? formatJSONResponse(mockDbResponse, 200)
      : formatJSONResponse(null, 404)
  } catch (error) {
    return formatJSONResponse(null, 500)
  }
}

export const getProductsList = middyfy(handler)
