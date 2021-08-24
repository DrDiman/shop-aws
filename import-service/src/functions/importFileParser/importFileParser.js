import { errorResponse, successResponse } from "@libs/apiGateway"
import { middyfy } from "@libs/middleware"
import { s3 } from "@services/s3"
import { StatusCode } from "@enums/StatusCode"

const handler = async (event) => {
  try {
    console.log(`LOG event`, event)

    const products = await s3.createProducts(event.Records)
    console.log(`LOG created products`, products)

    await s3.moveToParsedFolder(event.Records)

    return successResponse(products, StatusCode.CREATED)
  } catch (error) {
    console.log("LOG error importFileParser", error)
    return errorResponse()
  }
}

export const importFileParser = middyfy(handler)
