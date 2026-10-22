import test from 'node:test';
import assert from 'node:assert/strict';
import { isAdministrator, OWNER_UID } from '../lib/admin-access.ts';
test('only the verified owner UID can enter the admin panel', async () => {
  assert.equal(await isAdministrator({uid:OWNER_UID}), true);
  for (const user of [{uid:'customer'}, {uid:'',role:'admin'}, {uid:'customer',admin:true}]) {
    assert.equal(await isAdministrator(user), false);
  }
});
