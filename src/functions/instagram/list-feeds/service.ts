import Axios, { AxiosError, AxiosRequestConfig, AxiosResponse, } from 'axios'
import { ApiError } from '../../../utils/apiError'

export class InstagramService {
  public static async listFeeds(): Promise<any> {
    return await this.getLastFeeds()
  }

  private static async getLastFeeds(): Promise<any> {
    return [ { feed1: 'firstField' }]
  }

  private static async getRefreshToken(): Promise<any> {
    return Axios.put(
      `/v1/object/subscription`,
      {
        paramA: 'e'
      },
      await this.getRequestConfig()
    )
      .catch((error: AxiosError) => { throw new ApiError('InstagramService', 'Error during get refresh token to instragram', error) })
      .then((response: AxiosResponse) => response.data)
  }

  private static async getRequestConfig(): Promise<AxiosRequestConfig> {
    const config = {
      headers: { Authorization: `Bearer eee` }
    }
    // if (json) {
      config.headers['Content-Type'] = 'application/json'
    // }
  
    return config
  }
}

