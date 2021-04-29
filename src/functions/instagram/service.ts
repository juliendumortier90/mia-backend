import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import Axios, { AxiosError, AxiosResponse } from 'axios'
import { DynamoActions } from '../../utils/dynamodb'
import { Logger } from '../..//utils/logger'
import { ApiError } from '../../utils/apiError'
import { InstagramAuthenticationService } from './authentication/service'

const databaseService: DocumentClient = new DocumentClient()
const DB_NAME_INSTA_LAST_FEED = 'mia-backend-instagram-last-feed'

export class InstagramService {

  public static async listFeeds(): Promise<any> {
    return await DynamoActions.scan({ TableName: DB_NAME_INSTA_LAST_FEED }, databaseService)
  }

  // called by job
  public static async refreshLastFeeds() {
    const lastFeeds = await this.getLastFeedsFromInstagram()
    await this.updateLastFeedsInDb(lastFeeds)
  }

  private static async getLastFeedsFromInstagram(): Promise<any> {
    const token = await InstagramAuthenticationService.getTokenFromSSM()
    const me = await InstagramAuthenticationService.getMeFromSSM()
    return Axios.get(`https://graph.instagram.com/${me}/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,username&access_token=${token}`)
      .catch((error: AxiosError) => {
        throw new ApiError('InstagramService', 'Error during get media from instagram', { error, errorData: error.response.data})
      })
      .then((response: AxiosResponse) => response.data.data)
  }

  private static async updateLastFeedsInDb(lastFeeds: Array<any>) {

    const rows = await DynamoActions.scan({ TableName: DB_NAME_INSTA_LAST_FEED }, databaseService)

    // delete all
    const deleteItems = []
    for (let i = 0; i < rows.length; i += 1) {
      deleteItems.push(
        DynamoActions.delete(
          { TableName: DB_NAME_INSTA_LAST_FEED, Key: { id: rows[i].id } },
          databaseService
        )
      )
    }
    await Promise.all(deleteItems)

    // add all
    const inserts: Promise<void>[] = []
    for (let i = 0; i < lastFeeds.length; i += 1) {
      inserts.push(
        DynamoActions.put({ TableName: DB_NAME_INSTA_LAST_FEED, Item: lastFeeds[i] }, databaseService)
      )
    }

    await Promise.all(inserts).then(() => {
      Logger.logInfo('Instagram Service', 'last instagram feeds successfully updated')
    })
  }
}