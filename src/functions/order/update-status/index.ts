import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { Response } from '../../../utils/reponse'
import { OrderService, OrderStatusEnum } from '../order.service'
import { ApiError } from '../../../utils/apiError'

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> =>   {
  try {
    const data = JSON.parse(event['body'])
    const status = data.status
    if (status != OrderStatusEnum.SENT && status != OrderStatusEnum.WAITING ) {
      throw new ApiError('Update order status Error', "le statut n'est pas bon", status)
    }
    return Response.makeSuccessResponse(await OrderService.updateStatus(data.id, status))
  } catch (error) {
    return Response.makeErrorResponse(error)
  }
}