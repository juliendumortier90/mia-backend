import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { Response } from '../../../utils/reponse'
import { OrderService } from '../order.service'

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> =>   {
  try {
    const data = JSON.parse(event['body'])
    const comment = data.comment
    return Response.makeSuccessResponse(await OrderService.updateComment(data.id, comment))
  } catch (error) {
    return Response.makeErrorResponse(error)
  }
}