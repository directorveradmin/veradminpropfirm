import { NextResponse } from 'next/server';

import { accountsRepository } from '../../../../lib/db/repositories/accountsRepository';
import { buildAccountsReadModel } from '../../../../lib/services/read-models/accountsReadModel';

export async function GET() {
  try {
    const accounts = accountsRepository.listAccountsForAccountsList();
    const readModel = buildAccountsReadModel(accounts);

    return NextResponse.json(readModel);
  } catch (error) {
    console.error('Failed to load accounts list read model.', error);

    return NextResponse.json(
      { error: 'Failed to load accounts.' },
      { status: 500 },
    );
  }
}