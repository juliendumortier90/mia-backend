import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { ApiError } from '../../../utils/apiError'
import { Response } from '../../../utils/reponse'
import { ShopItem, ShopService } from '../shop.service'

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> =>   {
  try {
    const item = JSON.parse(event['body'])
    if(!item.type || !item.name || !item.price || !item.pictures) {
      throw new ApiError('add item', 'shop item to add not valid', { message: 'shop item to add not valid'})
    }
    await ShopService.addItem(item as ShopItem)
    return Response.makeSuccessResponse()
  } catch (error) {
    return Response.makeErrorResponse(error)
  }
}