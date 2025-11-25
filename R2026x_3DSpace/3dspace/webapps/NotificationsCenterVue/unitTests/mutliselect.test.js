import { describe, expect, test, beforeAll } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { setHistory } from './functions/setHistory';
import { setup } from './functions/setup';
import { setSettings } from './functions/setSettings';
import useNotificationsStore from '../src/stores/notifications';

const { initDriver, init } = setup();

describe('Notification Center Vue Multi Select ODT', () => {
  beforeAll(async () => {
    setActivePinia(createPinia());
  });
  test('Init Driver', async () => {
    await initDriver();
    //
    expect(true).toBe(true);
  });

  test('Init Center', async () => {
    await init();
    //
    expect(true).toBe(true);
  });

  test('setHistory', () => {
    expect(setHistory()).toBe(true);
    //
    const store = useNotificationsStore();
    console.log('setHistory', store.notifications.size);
  });

  test('setSettings', () => {
    expect(setSettings()).toBe(true);
  });

   // todo : add more tests specific to the multi select

});
