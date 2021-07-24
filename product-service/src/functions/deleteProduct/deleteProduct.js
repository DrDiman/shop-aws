import { errorResponse, successResponse } from "@libs/apiGateway"
import { middyfy } from "@libs/middleware"
import { pgProducts } from "@services/pgProducts"

const handler = async (event) => {
  try {
    console.log(`LOG event`, event)

    const { id } = event.pathParameters

    const dbProduct = await pgProducts.deleteById(id)

    console.log("LOG put product db response", dbProduct)

    return successResponse(dbProduct)
  } catch (error) {
    console.log("LOG error deleteProduct", error)
    return errorResponse()
  }
}

export const deleteProduct = middyfy(handler)
