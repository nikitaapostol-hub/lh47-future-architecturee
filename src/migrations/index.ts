import * as migration_20260816_185411_initial from './20260816_185411_initial';
import * as migration_20260908_071048_cms_content from './20260908_071048_cms_content';
import * as migration_20260908_073000_seed_content from './20260908_073000_seed_content';

export const migrations = [
  {
    up: migration_20260816_185411_initial.up,
    down: migration_20260816_185411_initial.down,
    name: '20260816_185411_initial',
  },
  {
    up: migration_20260908_071048_cms_content.up,
    down: migration_20260908_071048_cms_content.down,
    name: '20260908_071048_cms_content',
  },
  {
    up: migration_20260908_073000_seed_content.up,
    down: migration_20260908_073000_seed_content.down,
    name: '20260908_073000_seed_content'
  },
];
