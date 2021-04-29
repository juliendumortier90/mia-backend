import Axios, { AxiosError, AxiosResponse } from 'axios'
import { ApiError } from '../../utils/apiError'
import { InstagramAuthenticationService } from './authentication/service';

export class InstagramService {
  public static async listFeeds(): Promise<any> {
    const token = await InstagramAuthenticationService.getTokenFromSSM()
    const me = await InstagramAuthenticationService.getMeFromSSM()
    return Axios.get(`https://graph.instagram.com/${me}/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,username&access_token=${token}`)
      .catch((error: AxiosError) => {
        throw new ApiError('InstagramService', 'Error during get media from instagram', { error, errorData: error.response.data})
      })
      .then((response: AxiosResponse) => response.data)
  }
}