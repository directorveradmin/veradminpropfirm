export interface AccountDetailViewModel {
  accountId: string
  headline: string
  summary: string
}

export function buildAccountDetailViewModel(accountId: string): AccountDetailViewModel {
  return {
    accountId,
    headline: 'Account Detail scaffold',
    summary: 'Recovered placeholder until canonical Step 5 account-detail mapper is restored.',
  }
}
