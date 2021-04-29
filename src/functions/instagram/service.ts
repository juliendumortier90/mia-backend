import Axios, { AxiosError, AxiosResponse } from 'axios'
import FormData from 'form-data'
import { ApiError } from '../../utils/apiError'
import { Logger } from '../../utils/logger'
import AWS, { SSM } from 'aws-sdk';

const clientSecret = '97db3bb97766754322071fb46426c769'
const ssm = new AWS.SSM({})

export class InstagramService {

  public static async listFeeds(): Promise<any> {
    return await InstagramService.getTokenFromSSM()
    // return await this.getLastFeeds()
  }

  public static async getLastFeeds(): Promise<any> {
    return [ { feed1: 'firstField' }]
  }

  /** Authentication **/
  public static async onReceiveCode(code: string) {
    Logger.logInfo('InstagramService', 'Receive oAuth code: ' + JSON.stringify(code))

    // code to accesstoken
    const accessToken = await this.codeToAccessToken(code)
    console.log('AT : ' + accessToken)
    // access token to token long durée
    const longAccessToken = await this.accessTokenToLongAccessToken(accessToken)
    console.log('LAT : ' + longAccessToken)

    // token long durée to ssm parameter
    await this.saveTokenToSSM(longAccessToken)
  }

  private static async codeToAccessToken(code: string): Promise<string> {
    const data = new FormData();
    data.append('client_id', '880027855879954');
    data.append('client_secret', clientSecret);
    data.append('grant_type', 'authorization_code');
    data.append('redirect_uri', 'https://sb59re9hg9.execute-api.eu-west-1.amazonaws.com/integ/instagram/oauth');
    data.append('code', code);
    return Axios.post(`https://api.instagram.com/oauth/access_token`, data, 
      { headers: data.getHeaders()}
      )
      .catch((error: AxiosError) => {
        throw new ApiError('InstagramService', 'Error during get access token from instagram', error.response.data)
      })
      .then((response: AxiosResponse) => response.data.access_token)
  }

  private static async accessTokenToLongAccessToken(accessToken: string): Promise<string> {
    const url = `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${clientSecret}&access_token=${accessToken}`
    
    return Axios.get(url)
      .catch((error: AxiosError) => {
        throw new ApiError('InstagramService', 'Error during convert access token to long access token from instagram', error.response.data)
      })
      .then((response: AxiosResponse) => response.data.access_token)
  }

  public static async refreshLongAccessToken(longAccessToken: string): Promise<string> {
    const url = `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${longAccessToken}`
    
    return Axios.get(url)
      .catch((error: AxiosError) => {
        throw new ApiError('InstagramService', 'Error during convert access token to long access token from instagram', error.response.data)
      })
      .then((response: AxiosResponse) => response.data.access_token)
  }

  public static async saveTokenToSSM(token: string) {
    const parameter: SSM.Types.PutParameterRequest = {
      Name: 'instagram-token',
      Value: token,
      Overwrite: true,
      Type: 'SecureString'
    }
    await ssm.putParameter(parameter).promise()
    Logger.logInfo('InstagramService', 'Instagram access token saved in SSM')
  }

  public static async getTokenFromSSM(): Promise<string> {
    const parameter: SSM.Types.GetParameterRequest = {
      Name: 'instagram-token',
      WithDecryption: true
    }
    const parameterResult = await ssm.getParameter(parameter).promise()
    return String(parameterResult.Parameter.Value)
  }
}