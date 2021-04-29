import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { Logger } from '../../utils/logger'
import { DynamoActions } from '../../utils/dynamodb'

const databaseService: DocumentClient = new DocumentClient()
const DB_NAME_SHOP_ITEM = 'mia-backend-shop-item'

export enum ShopTypeEnum {
    TSHIRT = 'TSHIRT',
    VESTE = 'VESTE',
    CASQUETTE = 'CASQUETTE',
    PORTECLE = 'PORTECLE'
}

export interface ShopItem {
    id: string
    type: ShopTypeEnum
    name: string
    price: number
    instock: boolean
    pictures: string[]
    paypalRef: string
}

export class ShopService {

  public static async listItems(): Promise<ShopItem[]> {
    return (await DynamoActions.scan({ TableName: DB_NAME_SHOP_ITEM }, databaseService)) as unknown as ShopItem[]
  }

  public static async addItem(item: ShopItem) {
    Logger.logInfo('ShopService', 'try to add : '+JSON.stringify(item))
    await DynamoActions.put({
        TableName: DB_NAME_SHOP_ITEM,
        Item: item
      }, databaseService)
  }

  public static async deleteItem(itemId: string) {
    await DynamoActions.delete({
        TableName: DB_NAME_SHOP_ITEM,
        Key: { id: itemId }
    }, databaseService)
  }
}