import { createDb } from '../../db/client';
import { edgeFleetFixture } from '../../db/fixtures/fleets/edgeFleet';
import { seedFixture } from './seed-utils';

function main() {
  const { sqlite, db, dbPath } = createDb();

  try {
    console.log(`Seeding edge fixture into ${dbPath}`);
    seedFixture(db, edgeFleetFixture);
    console.log('Edge fixture loaded.');
  } finally {
    sqlite.close();
  }
}

main();
