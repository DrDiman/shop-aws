import { ValidationError } from "yup"
import { errorResponse, successResponse } from "@libs/apiGateway"
import { middyfy } from "@libs/middleware"
import { pgProducts } from "@services/pgProducts"
import { Product } from "@models/Product"
import { StatusCode } from "@enums/StatusCode"

const handler = async (event) => {
  try {
    console.log(`LOG event`, event)

    const { body: incomingProduct } = event

    const validProduct = await Product.schema.validate(incomingProduct)

    const dbProduct = validProduct.id
      ? await pgProducts.updateById(validProduct, validProduct.id)
      : await pgProducts.put(validProduct)

    console.log("LOG put product db response", dbProduct)

    return successResponse(dbProduct)
  } catch (error) {
    if (ValidationError.isError(error)) {
      console.log("LOG ValidationError in putProduct", error)
      return errorResponse(StatusCode.BAD_REQUEST)
    }
    console.log("LOG error putProduct", error)
    return errorResponse()
  }
}

export const putProduct = middyfy(handler)
