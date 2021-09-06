import { ValidationError } from "yup"
import { errorResponse, successResponse } from "@libs/apiGateway"
import { middyfy } from "@libs/middleware"
import { s3 } from "@services/s3"
import { StatusCode } from "@enums/StatusCode"
import { queue } from "@services/queue"
import { Product } from "@models/Product"

const handler = async (event) => {
  try {
    console.log(`LOG event`, event)

    const products = await s3.parseUploadedCsv(event.Records)
    console.log(`LOG parsed products from csv`, products)

    const validProducts = products.map((product) =>
      Product.schema.validateSync(product)
    )

    for await (const product of validProducts) {
      await queue.sendMessage(product)
    }

    await s3.moveToParsedFolder(event.Records)

    return successResponse(products, StatusCode.CREATED)
  } catch (error) {
    if (ValidationError.isError(error)) {
      console.log("LOG ValidationError in importFileParser", error)
      await s3.moveToInvalidFolder(event.Records)
      return errorResponse(StatusCode.BAD_REQUEST)
    }

    console.log("LOG error importFileParser", error)
    return errorResponse()
  }
}

export const importFileParser = middyfy(handler)
