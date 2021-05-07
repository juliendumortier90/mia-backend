import { DocumentClient } from "aws-sdk/clients/dynamodb"
import { DynamoActions } from "../../utils/dynamodb"
import { Logger } from "../../utils/logger"
import { ShopItem } from "../shop/shop.service"

const databaseService: DocumentClient = new DocumentClient()
const DB_NAME_ORDER_ITEM = 'mia-backend-order-item'

export enum OrderStatusEnum {
    TO_SEND = 'TO_SEND',
    SENT = 'SENT',
    WAITING = 'WAITING'
}

export interface OrderItem {
    id: string
    payeeEmail: string
    shopItems: ShopItem[]
    paypalItems: any
    shipping: any
    payer: any
    status: OrderStatusEnum
    comment: string
}

export class OrderService {
  public static makeOrderItem(payeeEmail, items, paypalItems, shipping, payer): OrderItem {
      const id = Math.random().toString(36).substr(2, 15)
      Logger.logInfo('OrderService', 'create id for new order : ' + id)
      return {
        id: id,
        payeeEmail: payeeEmail,
        shopItems: items,
        paypalItems: paypalItems,
        shipping: shipping,
        payer: payer,
        status: OrderStatusEnum.TO_SEND,
        comment: ''
      }
  }

  public static async listItems(): Promise<OrderItem[]> {
    let params = {
      TableName : DB_NAME_ORDER_ITEM
    };
    return (await DynamoActions.scan(params, databaseService)) as unknown as OrderItem[]
  }

  public static async addOrder(item: OrderItem) {
    Logger.logInfo('OrderService', 'Add order : ' + JSON.stringify(item))
    await DynamoActions.put({
        TableName: DB_NAME_ORDER_ITEM,
        Item: item
      }, databaseService)
  }
}