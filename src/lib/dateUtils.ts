/**
 * Global Date Utilities for Indian Standard Time (IST)
 * All date/time operations in this CRM use Asia/Kolkata timezone (UTC+5:30)
 */

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import relativeTime from 'dayjs/plugin/relativeTime'

// Extend dayjs with timezone support
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(relativeTime)

// Indian Standard Time
export const TIMEZONE = 'Asia/Kolkata'
export const TIMEZONE_OFFSET = '+05:30'

/**
 * Get current date/time in IST
 */
export const now = () => dayjs().tz(TIMEZONE)

/**
 * Parse a date string and convert to IST
 */
export const parseDate = (date: string | Date | dayjs.Dayjs) => dayjs(date).tz(TIMEZONE)

/**
 * Format date for display (Indian format)
 */
export const formatDisplay = (date: string | Date | dayjs.Dayjs, format = 'DD MMM YYYY') => 
  parseDate(date).format(format)

/**
 * Format date with time for display
 */
export const formatDateTime = (date: string | Date | dayjs.Dayjs) => 
  parseDate(date).format('DD MMM YYYY, hh:mm A')

/**
 * Format date for database queries (preserves IST)
 */
export const formatForDB = (date: dayjs.Dayjs) => date.format('YYYY-MM-DDTHH:mm:ss')

/**
 * Get start of day in IST
 */
export const startOfDay = (date?: string | Date | dayjs.Dayjs) => 
  (date ? parseDate(date) : now()).startOf('day')

/**
 * Get end of day in IST
 */
export const endOfDay = (date?: string | Date | dayjs.Dayjs) => 
  (date ? parseDate(date) : now()).endOf('day')

/**
 * Get start of month in IST
 */
export const startOfMonth = (date?: string | Date | dayjs.Dayjs) => 
  (date ? parseDate(date) : now()).startOf('month')

/**
 * Get end of month in IST
 */
export const endOfMonth = (date?: string | Date | dayjs.Dayjs) => 
  (date ? parseDate(date) : now()).endOf('month')

/**
 * Get start of year in IST
 */
export const startOfYear = (date?: string | Date | dayjs.Dayjs) => 
  (date ? parseDate(date) : now()).startOf('year')

/**
 * Get end of year in IST
 */
export const endOfYear = (date?: string | Date | dayjs.Dayjs) => 
  (date ? parseDate(date) : now()).endOf('year')

/**
 * Date range presets for filters (all in IST)
 */
export const getDatePresets = () => {
  const today = now()
  
  return {
    today: {
      start: formatForDB(today.startOf('day')),
      end: formatForDB(today.endOf('day')),
    },
    yesterday: {
      start: formatForDB(today.subtract(1, 'day').startOf('day')),
      end: formatForDB(today.subtract(1, 'day').endOf('day')),
    },
    last7Days: {
      start: formatForDB(today.subtract(6, 'day').startOf('day')),
      end: formatForDB(today.endOf('day')),
    },
    last30Days: {
      start: formatForDB(today.subtract(29, 'day').startOf('day')),
      end: formatForDB(today.endOf('day')),
    },
    thisMonth: {
      start: formatForDB(today.startOf('month')),
      end: formatForDB(today.endOf('month')),
    },
    lastMonth: {
      start: formatForDB(today.subtract(1, 'month').startOf('month')),
      end: formatForDB(today.subtract(1, 'month').endOf('month')),
    },
    thisYear: {
      start: formatForDB(today.startOf('year')),
      end: formatForDB(today.endOf('year')),
    },
  }
}

/**
 * Check if a date is today (in IST)
 */
export const isToday = (date: string | Date | dayjs.Dayjs) => 
  parseDate(date).isSame(now(), 'day')

/**
 * Check if a date is in the past (in IST)
 */
export const isPast = (date: string | Date | dayjs.Dayjs) => 
  parseDate(date).isBefore(now())

/**
 * Get relative time (e.g., "2 hours ago")
 */
export const fromNow = (date: string | Date | dayjs.Dayjs) => 
  parseDate(date).fromNow()

/**
 * Export dayjs instance configured for IST
 */
export const dayjsIST = dayjs

// Set default timezone for all dayjs operations
dayjs.tz.setDefault(TIMEZONE)

export default {
  now,
  parseDate,
  formatDisplay,
  formatDateTime,
  formatForDB,
  startOfDay,
  endOfDay,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  getDatePresets,
  isToday,
  isPast,
  fromNow,
  TIMEZONE,
  TIMEZONE_OFFSET,
}
