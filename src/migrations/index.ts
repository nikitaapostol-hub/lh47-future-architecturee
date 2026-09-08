import * as migration_20260816_185411_initial from './20260816_185411_initial';
import * as migration_20260908_071048_cms_content from './20260908_071048_cms_content';
import * as migration_20260908_073000_seed_content from './20260908_073000_seed_content';
import * as migration_20260908_114635_speaker_slots from './20260908_114635_speaker_slots';
import * as migration_20260908_115200_seed_content_late from './20260908_115200_seed_content_late';

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
    name: '20260908_073000_seed_content',
  },
  {
    up: migration_20260908_114635_speaker_slots.up,
    down: migration_20260908_114635_speaker_slots.down,
    name: '20260908_114635_speaker_slots',
  },
  {
    up: migration_20260908_115200_seed_content_late.up,
    down: migration_20260908_115200_seed_content_late.down,
    name: '20260908_115200_seed_content_late'
  },
];
