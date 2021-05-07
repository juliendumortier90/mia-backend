import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { OrderService } from '../../order/order.service'
import { ApiError } from '../../../utils/apiError'
import { Logger } from '../../../utils/logger'
import { Response } from '../../../utils/reponse'
import { PaypalService } from '../paypal/paypal.service'
import { ShopService } from '../shop.service'

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> =>   {
  try {
    const clientOrder = JSON.parse(event['body'])
    
    Logger.logInfo('On Complete Transaction', 'clientOrder: ' + JSON.stringify(clientOrder))

    const paypalOrder = await PaypalService.getOrderById(clientOrder.id)
    Logger.logInfo('On Complete Transaction', 'paypalOrder: ' + JSON.stringify(paypalOrder))
    const order = paypalOrder.result

    if (order.status !== 'COMPLETED') {
      throw new ApiError('On Complete Transaction', 'the order status is not COMPLETED', order)
    }
    
    // check if total price is correct
    if (order.purchase_units.length < 1
            || clientOrder.purchase_units.length < 1
            || 
            (order.purchase_units[0].amount.value !== clientOrder.purchase_units[0].amount.value)) {
      throw new ApiError('On Complete Transaction', 'clientOrderPrice is not equal to paypalOrder price', order)
    }

    const payeeEmail = order.purchase_units[0].payee.email_address
    const paypalItems = order.purchase_units[0].items
    /* paypalItems:
        {
            "name": "azezae",
            "unit_amount": {
                "currency_code": "EUR",
                "value": "4.00"
            },
            "tax": {
                "currency_code": "EUR",
                "value": "0.00"
            },
            "quantity": "1",
            "description": "id"
        }
    */
    const shipping = order.purchase_units[0].shipping
    /* shipping:
        {
            "name": {
                "full_name": "John Doe"
            },
            "address": {
                "address_line_1": "Av. de la Pelouse",
                "admin_area_2": "Paris",
                "admin_area_1": "Alsace",
                "postal_code": "75002",
                "country_code": "FR"
            }
        }
    */

    const payer = order.payer
    /* payer:
        {
            "name": {
                "given_name": "John",
                "surname": "Doe"
            },
            "email_address": "sb-z4t43d6109953@personal.example.com",
            "payer_id": "RLNJGB9JWHP4Y",
            "phone": {
                "phone_number": {
                    "national_number": "0459518904"
                }
            },
            "address": {
                "country_code": "FR"
            }
        }
    */

    const items = []
    // update stock
    for (let paypalItem of paypalItems) {
      const itemDb = await ShopService.getItemById(paypalItem.description)
      items.push(itemDb)
      await ShopService.decreaseStockItem(itemDb.id)
    }

    // make command object item with status TO_SEND
    const orderItem = OrderService.makeOrderItem(payeeEmail, items, paypalItems, shipping, payer)
    // save in db
    await OrderService.addOrder(orderItem)

    // TODO here, send email or other notification

    return Response.makeSuccessResponse()
  } catch (error) {
    return Response.makeErrorResponse(error)
  }
}

