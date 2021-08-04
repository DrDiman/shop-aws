import { errorResponse, successResponse } from "@libs/apiGateway"
import { middyfy } from "@libs/middleware"
import { s3 } from "@services/s3"

const handler = async (event) => {
  try {
    console.log(`LOG event`, event)

    const {
      queryStringParameters: { name },
    } = event

    const url = await s3.getPutSignedUrl(name)
    console.log("LOG signed url to put file", url)

    return successResponse(url)
  } catch (error) {
    console.log("LOG error importProductsFile", error)
    return errorResponse()
  }
}

export const importProductsFile = middyfy(handler)
