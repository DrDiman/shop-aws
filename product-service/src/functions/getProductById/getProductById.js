import { errorResponse, successResponse } from "@libs/apiGateway"
import { middyfy } from "@libs/middleware"
import { StatusCode } from "@enums/StatusCode"
import { pgProducts } from "@services/pgProducts"

const handler = async (event) => {
  try {
    console.log(`LOG event`, event)

    const { id } = event.pathParameters

    const product = await pgProducts.getById(id)

    console.log("LOG get product by id db response", product)

    if (!product) {
      return errorResponse(StatusCode.NOT_FOUND)
    }

    return successResponse(product)
  } catch (error) {
    console.log("LOG error in getProductById", error)
    return errorResponse()
  }
}

export const getProductById = middyfy(handler)
