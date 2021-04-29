import { APIGatewayProxyResult } from 'aws-lambda'
import { Response } from '../../../utils/reponse'
import { ShopService } from '../service'

export const handler = async (): Promise<APIGatewayProxyResult> =>   {
  try {
    return Response.makeSuccessResponse(await ShopService.listItems())
  } catch (error) {
    return Response.makeErrorResponse(error)
  }
}