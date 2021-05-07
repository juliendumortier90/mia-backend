import { DocumentClient, ItemList } from 'aws-sdk/clients/dynamodb'
import { AWSError } from 'aws-sdk/lib/error'
import { ApiError } from './apiError'
import { Logger } from './logger'

export class DynamoActions {
  static async scan(params: DocumentClient.ScanInput, databaseService: DocumentClient): Promise<ItemList> {
    const result = await databaseService
      .scan(params)
      .promise()
      .catch((error: AWSError) => {
        throw new ApiError('Dynamo scan', 'error during scan operation', error)
      })
    return result.Items
  }

  static async put(params: DocumentClient.PutItemInput, databaseService: DocumentClient): Promise<void> {
    await databaseService
      .put(params)
      .promise()
      .catch((error: AWSError) => {
        throw new ApiError('Dynamo put', 'error during put operation', error)
      })
    Logger.logInfo('Dynamo put', 'Put item on dynamo: ' + JSON.stringify(params.Item))
  }

  static async get(
    params: DocumentClient.GetItemInput,
    databaseService: DocumentClient
  ): Promise<DocumentClient.AttributeMap | undefined> {
    const result = await databaseService
      .get(params)
      .promise()
      .catch((error: AWSError) => {
        throw new ApiError('Dynamo get', 'error during get operation', error)
      })
    return result.Item
  }

  static async update(
    params: DocumentClient.UpdateItemInput,
    databaseService: DocumentClient
  ): Promise<DocumentClient.AttributeMap | undefined> {
    const result = await databaseService
      .update(params)
      .promise()
      .catch((error: AWSError) => {
        throw new ApiError('Dynamo update', 'error during update operation', error)
      })
    return result
  }

  static async delete(params: DocumentClient.DeleteItemInput, databaseService: DocumentClient): Promise<void> {
    await databaseService
      .delete(params)
      .promise()
      .catch((error: AWSError) => {
        throw new ApiError('Dynamo delete', 'error during delete operation', error)
      })
      Logger.logInfo('Dynamo put', 'Delete item on dynamo: ' + JSON.stringify(params.Key))
  }
}
