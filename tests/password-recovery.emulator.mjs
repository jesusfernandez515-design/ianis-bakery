import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { initializeApp, deleteApp } from 'firebase/app';
import { connectAuthEmulator, getAuth, createUserWithEmailAndPassword, signOut, confirmPasswordReset, signInWithEmailAndPassword } from 'firebase/auth';
import { requestPasswordRecovery } from '../lib/password-recovery.ts';

test('password recovery resets only a local fixture account and does not disclose missing accounts', { skip: !process.env.FIREBASE_AUTH_EMULATOR_HOST }, async () => {
  const host=process.env.FIREBASE_AUTH_EMULATOR_HOST;
  assert.match(host,/^127\.0\.0\.1:\d+$/,'This test must use a local Auth emulator');
  const projectId='demo-ianis-auth';
  const app=initializeApp({projectId,apiKey:'fake-emulator-key',authDomain:'localhost'},'recovery-test');
  const auth=getAuth(app);
  connectAuthEmulator(auth,`http://${host}`,{disableWarnings:true});
  try {
    const email=`reset-${randomUUID()}@example.invalid`;
    await createUserWithEmailAndPassword(auth,email,'FixtureBefore123!');
    await signOut(auth);
    const existing=await requestPasswordRecovery(auth,`  ${email.toUpperCase()}  `);
    assert.equal(existing.type,'success');
    const missing=await requestPasswordRecovery(auth,`missing-${randomUUID()}@example.invalid`);
    assert.deepEqual(missing,existing,'Both addresses must receive the same notice');
    const response=await fetch(`http://${host}/emulator/v1/projects/${projectId}/oobCodes`);
    assert.equal(response.status,200);
    const payload=await response.json();
    const action=payload.oobCodes.find(item=>item.email===email && item.requestType==='PASSWORD_RESET');
    assert.ok(action,'The local emulator must generate a password recovery action');
    await confirmPasswordReset(auth,action.oobCode,'FixtureAfter456!');
    await assert.rejects(signInWithEmailAndPassword(auth,email,'FixtureBefore123!'));
    const credential=await signInWithEmailAndPassword(auth,email,'FixtureAfter456!');
    assert.equal(credential.user.email,email);
    assert.equal((await requestPasswordRecovery(auth,'not-an-email')).type,'error');
    assert.equal((await requestPasswordRecovery(auth,'')).type,'error');
  } finally { await deleteApp(app); }
});
