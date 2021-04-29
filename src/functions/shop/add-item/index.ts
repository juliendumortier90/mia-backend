import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { ApiError } from '../../../utils/apiError'
import { Response } from '../../../utils/reponse'
import { ShopItem, ShopService } from '../service'

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> =>   {
  try {
    const item = JSON.parse(event['body'])
    if(!item.id || !item.type || !item.name || !item.price) {
      throw new ApiError('add item', 'shop item to add not valid', { message: 'shop item to add not valid'})
    }
    return Response.makeSuccessResponse(await ShopService.addItem(item as ShopItem))
  } catch (error) {
    return Response.makeErrorResponse(error)
  }
}