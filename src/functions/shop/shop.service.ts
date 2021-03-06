import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { Logger } from '../../utils/logger'
import { DynamoActions } from '../../utils/dynamodb'
import { ApiError } from '../../utils/apiError'

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
    stock: number
    pictures: string[]
    partner: boolean
    partnerName: string
    paypalRef: string
}

export class ShopService {
  public static async getItemsByIds(ids): Promise<ShopItem[]> {
    const shopItemIdsAttributeValues = ids.reduce(
      (shopItemIdsAttributeValues: any, id: string) => {
          const shopItemKey = ':' + id;
          shopItemIdsAttributeValues[shopItemKey.toString()] = id;
          return shopItemIdsAttributeValues;
      },
      {},
    );

    const params: DocumentClient.ScanInput = {
      TableName: DB_NAME_SHOP_ITEM,
      FilterExpression: `id IN (${Object.keys(
        shopItemIdsAttributeValues,
      )})`,
      ExpressionAttributeValues: shopItemIdsAttributeValues,
    };

    return (await DynamoActions.scan(params, databaseService)) as unknown as ShopItem[]
  }

  public static async getItemByName(name: string): Promise<ShopItem> {
    let params = {
      TableName : DB_NAME_SHOP_ITEM,
      FilterExpression: "contains(#name, :name)",
      ExpressionAttributeNames: {
          "#name": "name",
      },
      ExpressionAttributeValues: {
          ":name": name,
      }       
    };
    const items = (await DynamoActions.scan(params, databaseService)) as unknown as ShopItem[]
    if (items.length == 0) {
      throw new ApiError('getItemByName', 'no item for name: ' + name, name)
    }
    return items[0]
  }

  public static async listItems(): Promise<ShopItem[]> {
    let params = {
      TableName : DB_NAME_SHOP_ITEM,
      FilterExpression: "NOT contains(#id, :idpart)",
      ExpressionAttributeNames: {
          "#id": "id",
      },
      ExpressionAttributeValues: {
          ":idpart": "_deleted",
      }       
    };
    return (await DynamoActions.scan(params, databaseService)) as unknown as ShopItem[]
  }

  public static async addItem(item: ShopItem) {
    if (item.id == null || item.id.length < 1) {
      const newId = Math.random().toString(36).substr(2, 15)
      item.id = newId
      Logger.logInfo('ShopService', 'create id for new item : ' + newId)
    }
    Logger.logInfo('ShopService', 'Add item : '+JSON.stringify(item))
    await DynamoActions.put({
        TableName: DB_NAME_SHOP_ITEM,
        Item: item
      }, databaseService)
  }

  public static async getItemById(itemId: string): Promise<ShopItem> {
    return await DynamoActions.get({
      TableName: DB_NAME_SHOP_ITEM,
      Key: { id: itemId }
    }, databaseService) as ShopItem
  }

  public static async deleteItem(itemId: string) {
    const item = await DynamoActions.get({
      TableName: DB_NAME_SHOP_ITEM,
      Key: { id: itemId }
    }, databaseService)
    item.id = item.id+'_deleted'

    await DynamoActions.put({
      TableName: DB_NAME_SHOP_ITEM,
      Item: item
    }, databaseService)

    await DynamoActions.delete({
        TableName: DB_NAME_SHOP_ITEM,
        Key: { id: itemId }
    }, databaseService)
  }

  public static async decreaseStockItem(itemId: string) {
    const item = await DynamoActions.get({
      TableName: DB_NAME_SHOP_ITEM,
      Key: { id: itemId }
    }, databaseService)

    const updatedStock = item.stock - 1

    const params = {
      TableName:DB_NAME_SHOP_ITEM,
      Key: { id: itemId },
      UpdateExpression: "set stock = :s",
      ExpressionAttributeValues:{
          ":s": updatedStock
      },
      ReturnValues:"UPDATED_NEW"
    }

    await DynamoActions.update(params, databaseService)
  }
}