import { createDb } from '../../db/client';
import { demoFleetFixture } from '../../db/fixtures/fleets/demoFleet';
import { seedFixture } from './seed-utils';

function main() {
  const { sqlite, db, dbPath } = createDb();

  try {
    console.log(`Seeding demo fixture into ${dbPath}`);
    seedFixture(db, demoFleetFixture);
    console.log('Demo fixture loaded.');
  } finally {
    sqlite.close();
  }
}

main();
