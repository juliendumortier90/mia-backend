import { APIGatewayProxyResult } from 'aws-lambda'
import { Response } from '../../../utils/reponse'
import { OrderService } from '../order.service'

export const handler = async (): Promise<APIGatewayProxyResult> =>   {
  try {
    return Response.makeSuccessResponse(await OrderService.listItems())
  } catch (error) {
    return Response.makeErrorResponse(error)
  }
}