import * as migration_20260816_185411_initial from './20260816_185411_initial';
import * as migration_20260908_071048_cms_content from './20260908_071048_cms_content';
import * as migration_20260908_073000_seed_content from './20260908_073000_seed_content';
import * as migration_20260908_114635_speaker_slots from './20260908_114635_speaker_slots';
import * as migration_20260908_115200_seed_content_late from './20260908_115200_seed_content_late';
import * as migration_20260927_195833_arch_makers_2026 from './20260927_195833_arch_makers_2026';
import * as migration_20260927_200500_arch_makers_content from './20260927_200500_arch_makers_content';
import * as migration_20260928_080623_arch_makers_admin from './20260928_080623_arch_makers_admin';
import * as migration_20260928_080628_arch_makers_admin_cleanup from './20260928_080628_arch_makers_admin_cleanup';
import * as migration_20260928_080700_arch_makers_admin_data from './20260928_080700_arch_makers_admin_data';

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
    name: '20260908_115200_seed_content_late',
  },
  {
    up: migration_20260927_195833_arch_makers_2026.up,
    down: migration_20260927_195833_arch_makers_2026.down,
    name: '20260927_195833_arch_makers_2026',
  },
  {
    up: migration_20260927_200500_arch_makers_content.up,
    down: migration_20260927_200500_arch_makers_content.down,
    name: '20260927_200500_arch_makers_content',
  },
  {
    up: migration_20260928_080623_arch_makers_admin.up,
    down: migration_20260928_080623_arch_makers_admin.down,
    name: '20260928_080623_arch_makers_admin',
  },
  {
    up: migration_20260928_080628_arch_makers_admin_cleanup.up,
    down: migration_20260928_080628_arch_makers_admin_cleanup.down,
    name: '20260928_080628_arch_makers_admin_cleanup',
  },
  {
    up: migration_20260928_080700_arch_makers_admin_data.up,
    down: migration_20260928_080700_arch_makers_admin_data.down,
    name: '20260928_080700_arch_makers_admin_data',
  },
];
