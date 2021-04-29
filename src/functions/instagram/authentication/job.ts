import { Logger } from '../../../utils/logger'
import { InstagramService } from '../service'

async function cronHandler(): Promise<void> {
  Logger.logInfo('InstagramAuthenticationJob', 'Starting cron to refresh instagram token')
  const oldRefreshToken = await InstagramService.getTokenFromSSM()
  const refreshToken = await InstagramService.refreshLongAccessToken(oldRefreshToken)
  await InstagramService.saveTokenToSSM(refreshToken)
}

exports.cronHandler = cronHandler
export default cronHandler
