import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { ApiError } from '../../../utils/apiError'
import { Response } from '../../../utils/reponse'
import { ShopService } from '../shop.service'

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> =>   {
  try {
    const item = JSON.parse(event['body'])
    if(!item.id) {
      throw new ApiError('delete item', 'item id not valid', { message: 'item id not valid'})
    }
    await ShopService.deleteItem(item.id)
    return Response.makeSuccessResponse()
  } catch (error) {
    return Response.makeErrorResponse(error)
  }
}