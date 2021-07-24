import { errorResponse, successResponse } from "@libs/apiGateway"
import { middyfy } from "@libs/middleware"
import { pgProducts } from "@services/pgProducts"

const handler = async (event) => {
  try {
    console.log(`LOG event`, event)

    const products = await pgProducts.getAll()

    console.log('LOG get all products db response', products)

    return successResponse(products)
  } catch (error) {
    console.log('LOG error in getProductsList', error)
    return errorResponse()
  }
}

export const getProductsList = middyfy(handler)
