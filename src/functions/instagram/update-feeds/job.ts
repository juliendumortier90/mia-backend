import { Logger } from '../../../utils/logger'
import { InstagramService } from '../service'

async function cronHandler(): Promise<void> {
  Logger.logInfo('UpdateFeeds', 'Starting cron to refresh last feeds')
  await InstagramService.refreshLastFeeds()
}

exports.cronHandler = cronHandler
export default cronHandler
