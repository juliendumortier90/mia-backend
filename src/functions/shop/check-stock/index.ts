import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { Logger } from '../../../utils/logger'
import { Response } from '../../../utils/reponse'
import { ShopService } from '../shop.service'

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> =>   {
  try {
    const itemsIds = JSON.parse(event['body'])

    Logger.logInfo('Check Stock Items', 'Check if ids is not in stock: '+ JSON.stringify(itemsIds))
    // check number of items in stock
    const items = await ShopService.getItemsByIds(itemsIds)
    for (let item of items) {
      const nbItemForId = itemsIds.filter(current => current == item.id).length
      if (item.stock < nbItemForId) {
        Logger.logError('Check Stock Items', 'item is out of stock: '+ JSON.stringify(item), item)
        return Response.makeSuccessResponse({ stock: 'ko', item: item})
      }
    }
    return Response.makeSuccessResponse({ stock: 'ok'})
  } catch (error) {
    return Response.makeErrorResponse(error)
  }
}