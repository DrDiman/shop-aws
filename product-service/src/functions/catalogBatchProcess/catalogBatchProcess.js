import { errorResponse, successResponse } from "@libs/apiGateway"
import { middyfy } from "@libs/middleware"
import { pgProducts } from "@services/pgProducts"
import { notifier } from "@services/notifier"

const handler = async (event) => {
  try {
    console.log(`LOG event`, event)

    const products = event.Records.map((r) => JSON.parse(r.body))

    const dbProducts = await pgProducts.insertAll(products)
    console.log("LOG inserted products db response", dbProducts)

    const message = dbProducts.map((p) => JSON.stringify(p)).join("\n")

    const attributes = notifier.getMessageAttributes(message)

    await notifier.publish(message, attributes)

    return successResponse(dbProducts)
  } catch (error) {
    console.log("LOG error catalogBatchProcess", error)
    return errorResponse()
  }
}

export const catalogBatchProcess = middyfy(handler)
