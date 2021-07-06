import { formatJSONResponse } from "@libs/apiGateway"
import { middyfy } from "@libs/middleware"
import { mockProductList } from "@functions/mockProductList.js"

const handler = async (event) => {
    return formatJSONResponse(mockProductList)
  }

export const getProductsList = middyfy(handler)
