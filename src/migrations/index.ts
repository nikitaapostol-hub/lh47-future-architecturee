import * as migration_20260816_185411_initial from './20260816_185411_initial';

export const migrations = [
  {
    up: migration_20260816_185411_initial.up,
    down: migration_20260816_185411_initial.down,
    name: '20260816_185411_initial'
  },
];
