import Axios, { AxiosError, AxiosResponse } from 'axios'
import FormData from 'form-data'
import { ApiError } from '../../../utils/apiError'
import { Logger } from '../../../utils/logger'
import AWS, { SSM } from 'aws-sdk';

const clientSecret = '97db3bb97766754322071fb46426c769'
const ssm = new AWS.SSM({})
const MADE_IN_APREMONT_USER_ID = '17841447868631649'

export class InstagramAuthenticationService {

  public static async startUpdateTokenProcess() {
    const oldRefreshToken = await InstagramAuthenticationService.getTokenFromSSM()
    const refreshToken = await InstagramAuthenticationService.refreshLongAccessToken(oldRefreshToken)
    await InstagramAuthenticationService.saveTokenToSSM(refreshToken)
  }

  /**
   * Create long access token from code of new user
   * @param code instagram user code, only 1 request with this code
   */
  public static async onReceiveCode(code: string) {
    Logger.logInfo('InstagramService', 'Receive oAuth code: ' + JSON.stringify(code))

    // code to accesstoken
    const accessToken = await this.codeToAccessToken(code)
    console.log('AT : ' + accessToken)
    // access token to long token long
    const longAccessToken = await this.accessTokenToLongAccessToken(accessToken)
    console.log('LAT : ' + longAccessToken)

    // get and save me
    const meId = await this.getMe(longAccessToken)

    if(meId !== MADE_IN_APREMONT_USER_ID) {
      throw new ApiError('InstagramService', '-Me- user id is not madeinapremont.', meId)
    }
    // long token to ssm parameter
    await this.saveTokenToSSM(longAccessToken)
    await this.saveMeToSSM(meId)
  }


  /************************/
  /** INSTAGRAM REQUESTS **/
  /************************/


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
  
  private static async getMe(token: string): Promise<string> {
    return Axios.get(`https://graph.instagram.com/me?access_token=${token}`)
      .catch((error: AxiosError) => {
        throw new ApiError('InstagramService', 'Error during get me from instagram', error.response.data)
      })
      .then((response: AxiosResponse) => response.data.id)
  }

  /*******************/
  /** SSM PARAMETER **/
  /*******************/

  private static async saveTokenToSSM(token: string) {
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

  private static async saveMeToSSM(meId: string) {
    const parameter: SSM.Types.PutParameterRequest = {
      Name: 'instagram-me',
      Value: meId,
      Overwrite: true,
      Type: 'SecureString'
    }
    await ssm.putParameter(parameter).promise()
    Logger.logInfo('InstagramService', 'Instagram me id saved in SSM')
  }

  public static async getMeFromSSM(): Promise<string> {
    const parameter: SSM.Types.GetParameterRequest = {
      Name: 'instagram-me',
      WithDecryption: true
    }
    const parameterResult = await ssm.getParameter(parameter).promise()
    return String(parameterResult.Parameter.Value)
  }
}