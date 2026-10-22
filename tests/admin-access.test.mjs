import test from 'node:test';
import assert from 'node:assert/strict';
import { isAdministrator } from '../lib/admin-access.ts';

test('only a trusted boolean admin claim grants access', async () => {
  for (const claims of [{}, { role: 'admin' }, { admin: 'true' }, { admin: false }]) {
    assert.equal(await isAdministrator({ getIdTokenResult: async () => ({ claims }) }), false);
  }
  assert.equal(await isAdministrator({ getIdTokenResult: async () => ({ claims: { admin: true } }) }), true);
});
test('a failed token check cannot authorize a customer', async () => {
  await assert.rejects(isAdministrator({ getIdTokenResult: async () => { throw new Error('expired'); } }));
});
