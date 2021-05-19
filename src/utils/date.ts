import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

export const formatDateFromDayjs = (date: dayjs.Dayjs): string => dayjs(date).tz('Europe/Paris').format('YYYY-MM-DD')

export const formatDate = (date: string): string => formatDateFromDayjs(dayjs(date))

export const getFormatedTodayDate = (): string => dayjs().tz('Europe/Paris').format('YYYY-MM-DD')
export const getFormatedTodayDateSlash = (): string => dayjs().tz('Europe/Paris').format('DD/MM/YYYY')
export const getFormatedTodayDateWithTime = (): string => dayjs().tz('Europe/Paris').format('YYYY-MM-DDThh:mm:ss')

export const dateIsAfterNow = (dateString: string): boolean => dayjs(dateString).isAfter(dayjs().tz('Europe/Paris'))

export const dateIsAfterNbDays = (dateString: string, nbDays: number): boolean =>
  dayjs(dateString).isAfter(dayjs().add(nbDays, 'day').tz('Europe/Paris'))

export const getNbDayBetweenTwoDate = (dateStart: string, dateEnd: string): number =>
  dayjs(dateEnd).diff(dayjs(dateStart), 'day')

export const getNbMonthBetweenTwoDate = (dateStart: string, dateEnd: string): number =>
  dayjs(dateEnd).diff(dayjs(dateStart), 'month')

export const addNbDayToDate = (date: string, nbDaysToAdd: number): string =>
  formatDateFromDayjs(dayjs(date).add(nbDaysToAdd, 'day'))

export const dateIsAfter = (baseDate: string, checkDate: string): boolean => dayjs(checkDate).isAfter(baseDate)
export const dateIsBefore = (baseDate: string, checkDate: string): boolean => dayjs(checkDate).isBefore(baseDate)

export const dateNowPlus = (number: number, type: dayjs.OpUnitType): string =>
  dayjs(getFormatedTodayDate()).add(number, type).format('YYYY-MM-DD')

export const dateTimeNowPlus = (number: number, type: dayjs.OpUnitType): string =>
  dayjs(getFormatedTodayDate()).add(number, type).format('YYYY-MM-DDThh:mm:ss')

export const timestampNowPlus = (number: number, type: dayjs.OpUnitType): number =>
  dayjs(getFormatedTodayDate()).add(number, type).unix()

export const dateNowPlusUnix = (number: number, type: dayjs.OpUnitType): string =>
  dayjs().add(number, type).valueOf().toString()
