import { seed } from '../seeders/seed';

function seedDb(): Promise<void> {
  return seed().then(
    (): void => {
      console.log('Seeding done!');
    }
  );
}

seedDb();
