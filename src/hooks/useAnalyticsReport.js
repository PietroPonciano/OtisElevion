import { reports } from '../data/static'
export const useAnalyticsReport = (periodDays = 30) => ({ report: reports[periodDays] ?? reports[30], loading: false, error: null })
