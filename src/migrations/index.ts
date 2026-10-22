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
import * as migration_20261012_090000_future_architecture_brand from './20261012_090000_future_architecture_brand';
import * as migration_20261012_120000_applications_mail from './20261012_120000_applications_mail';
import * as migration_20261012_140000_public_spaces_nomination from './20261012_140000_public_spaces_nomination';
import * as migration_20261014_120000_contacts_logo_texts from './20261014_120000_contacts_logo_texts';
import * as migration_20261014_120100_drop_home_labels from './20261014_120100_drop_home_labels';
import * as migration_20261014_150000_instagram from './20261014_150000_instagram';
import * as migration_20261014_160000_who_benefits from './20261014_160000_who_benefits';
import * as migration_20261014_160100_who_benefits_data from './20261014_160100_who_benefits_data';
import * as migration_20261016_081414_presale_forum from './20261016_081414_presale_forum';
import * as migration_20261016_081500_texts_1610 from './20261016_081500_texts_1610';
import * as migration_20261022_150000_mail_recipients from './20261022_150000_mail_recipients';

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
  {
    up: migration_20261012_090000_future_architecture_brand.up,
    down: migration_20261012_090000_future_architecture_brand.down,
    name: '20261012_090000_future_architecture_brand',
  },
  {
    up: migration_20261012_120000_applications_mail.up,
    down: migration_20261012_120000_applications_mail.down,
    name: '20261012_120000_applications_mail',
  },
  {
    up: migration_20261012_140000_public_spaces_nomination.up,
    down: migration_20261012_140000_public_spaces_nomination.down,
    name: '20261012_140000_public_spaces_nomination',
  },
  {
    up: migration_20261014_120000_contacts_logo_texts.up,
    down: migration_20261014_120000_contacts_logo_texts.down,
    name: '20261014_120000_contacts_logo_texts',
  },
  {
    up: migration_20261014_120100_drop_home_labels.up,
    down: migration_20261014_120100_drop_home_labels.down,
    name: '20261014_120100_drop_home_labels',
  },
  {
    up: migration_20261014_150000_instagram.up,
    down: migration_20261014_150000_instagram.down,
    name: '20261014_150000_instagram',
  },
  {
    up: migration_20261014_160000_who_benefits.up,
    down: migration_20261014_160000_who_benefits.down,
    name: '20261014_160000_who_benefits',
  },
  {
    up: migration_20261014_160100_who_benefits_data.up,
    down: migration_20261014_160100_who_benefits_data.down,
    name: '20261014_160100_who_benefits_data',
  },
  {
    up: migration_20261016_081414_presale_forum.up,
    down: migration_20261016_081414_presale_forum.down,
    name: '20261016_081414_presale_forum'
  },
  {
    up: migration_20261016_081500_texts_1610.up,
    down: migration_20261016_081500_texts_1610.down,
    name: '20261016_081500_texts_1610',
  },
  {
    up: migration_20261022_150000_mail_recipients.up,
    down: migration_20261022_150000_mail_recipients.down,
    name: '20261022_150000_mail_recipients',
  },
];
