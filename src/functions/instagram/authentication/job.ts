import { Logger } from '../../../utils/logger'
import { InstagramAuthenticationService } from './service'

async function cronHandler(): Promise<void> {
  Logger.logInfo('InstagramAuthenticationJob', 'Starting cron to refresh instagram token')
  await InstagramAuthenticationService.startUpdateTokenProcess()
}

exports.cronHandler = cronHandler
export default cronHandler
