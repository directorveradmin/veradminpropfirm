import type { AccountRepositoryRecord } from '../../db/repositories/accountsRepository';

const DEFAULT_DRAWDOWN_LIMIT = 0.05;
const DEFAULT_NON_INSTANT_TARGET_BALANCE = 53000;
const INSTANT_FUNDED_STAGE = 'INSTANT_FUNDED';

export type AccountListItemReadModel = {
  id: string;
  label: string;
  size: number;
  balance: number;
  highWaterMark: number;
  drawdownLimit: number;
  isTrailing: boolean;
  stage: string;
  drawdownType: string;
  tpTicks: number;
  slTicks: number;
  status: string;
  targetBalance: number;
};

export type AccountsReadModel = AccountListItemReadModel[];

function buildTargetBalance(account: AccountRepositoryRecord): number {
  if (account.stage === INSTANT_FUNDED_STAGE) {
    return account.balance;
  }

  return DEFAULT_NON_INSTANT_TARGET_BALANCE;
}

function buildAccountListItemReadModel(
  account: AccountRepositoryRecord,
): AccountListItemReadModel {
  return {
    id: account.id,
    label: account.label,
    size: account.accountSize,
    balance: account.balance,
    highWaterMark: account.highWaterMark,
    drawdownLimit: DEFAULT_DRAWDOWN_LIMIT,
    isTrailing: account.drawdownType === 'TRAILING',
    stage: account.stage,
    drawdownType: account.drawdownType,
    tpTicks: account.tpTicks,
    slTicks: account.slTicks,
    status: account.status,
    targetBalance: buildTargetBalance(account),
  };
}

export function buildAccountsReadModel(
  accounts: AccountRepositoryRecord[],
): AccountsReadModel {
  return accounts.map(buildAccountListItemReadModel);
}