// This acts as the main export hub so components can use: import * as readModels
export * from './loadScreens';

// Fallback safety mocks just in case any specific fetchers are missing from loadScreens
export const fetchAccountData = async () => ({});
export const fetchAlertsData = async () => ({});
export const fetchPayoutsData = async () => ({});
export const fetchCalendarData = async () => ({});
