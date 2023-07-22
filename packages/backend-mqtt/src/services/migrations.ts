import { MigrateModel, IMigrateDocument } from 'common/lib/models/migrateModel';
import { logger } from 'common/lib/logger';
import fs from 'fs/promises';
import path from 'path';
import { Config } from '../types';

const migrationFolder = path.join(__dirname, '../migrations');

async function loadMigration(
    fileName: string
): Promise<{ up: (config: Config) => Promise<void>; down: (config: Config) => Promise<void> }> {
    return import(path.join(migrationFolder, fileName));
}

export async function migrate(config: Config) {
    let migrations = await MigrateModel.findOne();
    if (!migrations) migrations = await MigrateModel.create({});

    const files = await fs.readdir(migrationFolder);

    for (const fileName of files) {
        if (!fileName.endsWith('.js')) continue;

        const migrationNumber = parseInt(fileName.split('_')[0]);
        if (migrations.applied.indexOf(migrationNumber) == -1) {
            logger.info('Running migration', fileName);

            const { up } = await loadMigration(fileName);
            await up(config);
            migrations.applied.push(migrationNumber);
        }
    }

    migrations.applied.sort();
    await migrations.save();
    logger.info('Migration done.');
}
