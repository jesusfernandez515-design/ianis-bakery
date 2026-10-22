import test from 'node:test';
import assert from 'node:assert/strict';
import Stripe from 'stripe';
import { quoteCheckout } from '../lib/checkout-quote.ts';
import { confirmsPayment } from '../lib/payment-confirmation.ts';
import { fallbackProducts } from '../lib/catalog.ts';
import { paymentsConfigured } from '../lib/server/stripe.ts';

test('production, live keys and incomplete configuration cannot enable payments', () => {
  const names=['VERCEL_ENV','PAYMENTS_MODE','STRIPE_SECRET_KEY','STRIPE_ACCOUNT_ID','STRIPE_WEBHOOK_SECRET','FIREBASE_ADMIN_PROJECT_ID','FIREBASE_ADMIN_CLIENT_EMAIL','FIREBASE_ADMIN_PRIVATE_KEY'];
  const original=Object.fromEntries(names.map(name=>[name,process.env[name]]));
  try {
    for(const name of names) delete process.env[name];
    assert.equal(paymentsConfigured(),false);
    Object.assign(process.env,{VERCEL_ENV:'preview',PAYMENTS_MODE:'test',STRIPE_SECRET_KEY:'rk_test_offline_fixture',STRIPE_ACCOUNT_ID:'acct_offline_fixture',STRIPE_WEBHOOK_SECRET:'whsec_offline_fixture',FIREBASE_ADMIN_PROJECT_ID:'demo-ianis',FIREBASE_ADMIN_CLIENT_EMAIL:'fixture@example.invalid',FIREBASE_ADMIN_PRIVATE_KEY:'offline_fixture'});
    assert.equal(paymentsConfigured(),true);
    process.env.VERCEL_ENV='production'; assert.equal(paymentsConfigured(),false);
    process.env.VERCEL_ENV='preview'; process.env.STRIPE_SECRET_KEY='sk_live_offline_fixture'; assert.equal(paymentsConfigured(),false);
    process.env.STRIPE_SECRET_KEY='rk_test_offline_fixture'; process.env.PAYMENTS_MODE='live'; assert.equal(paymentsConfigured(),false);
    process.env.PAYMENTS_MODE='test'; delete process.env.STRIPE_WEBHOOK_SECRET; assert.equal(paymentsConfigured(),false);
  } finally { for(const name of names) { if(original[name]===undefined) delete process.env[name]; else process.env[name]=original[name]; } }
});

const input = () => ({ customerName:'Cliente de prueba',customerPhone:'0000000000',delivery:'pickup',address:'',note:'',coupon:'',items:[{id:'nutella',qty:1,price:0.01,name:'Forged'}],expectedTotalCents:499 });
test('server ignores customer prices, names, totals and cookie counts', () => {
  const quote = quoteCheckout({...input(),total:0.01,itemCount:999},fallbackProducts);
  assert.equal(quote.totalCents,499);
  assert.equal(quote.items[0].name,'Nutella Supreme');
  assert.equal(quote.itemCount,1);
  assert.throws(()=>quoteCheckout({...input(),expectedTotalCents:1},fallbackProducts));
});
test('coupon rounds in cents and delivery is calculated by server', () => {
  const quote=quoteCheckout({...input(),coupon:' ianis10 ',delivery:'delivery',address:'Dirección ficticia',expectedTotalCents:749},fallbackProducts);
  assert.equal(quote.discount,0.5); assert.equal(quote.total,7.49);
});
test('boxes require exact flavors, count and authoritative premium charges', () => {
  const box={size:4,selections:[{id:'nutella',qty:3},{id:'coconut',qty:1}]};
  const body={...input(),items:[{id:'box-test',qty:2,price:0.01,box}],expectedTotalCents:3700};
  const quote=quoteCheckout(body,fallbackProducts);
  assert.equal(quote.totalCents,3700); assert.equal(quote.itemCount,8);
  for(const badBox of [undefined,{...box,size:5},{...box,selections:[{id:'nutella',qty:3}]},{...box,selections:[{id:'fake',qty:4}]},{...box,selections:[{id:'nutella',qty:2},{id:'nutella',qty:2}]}]) {
    assert.throws(()=>quoteCheckout({...body,items:[{id:'box-test',qty:1,box:badBox}]},fallbackProducts));
  }
});
test('rejects inactive, missing, invalid and excessive products and bad customer data', () => {
  for (const qty of [0,-1,1.5,101,NaN]) assert.throws(()=>quoteCheckout({...input(),items:[{id:'nutella',qty}]},fallbackProducts));
  for (const patch of [{items:[]},{items:[null]},{items:[{id:'missing',qty:1}]},{customerName:''},{customerPhone:'123'},{delivery:'unknown'},{coupon:'FREE'},{delivery:'delivery',address:''},{note:'x'.repeat(1001)}]) assert.throws(()=>quoteCheckout({...input(),...patch},fallbackProducts));
  assert.throws(()=>quoteCheckout(input(),fallbackProducts.map(p=>({...p,active:false}))));
  assert.throws(()=>quoteCheckout(input(),[]));
  assert.throws(()=>quoteCheckout({...input(),items:[{id:'nutella',qty:100},{id:'coconut',qty:100}],expectedTotalCents:104800},fallbackProducts));
});
const attempt={sessionId:'cs_test_fixture',orderId:'online-fixture',totalCents:499,currency:'usd',mode:'test',paid:false};
const session={id:'cs_test_fixture',livemode:false,payment_status:'paid',currency:'usd',amount_total:499,client_reference_id:'online-fixture',metadata:{orderId:'online-fixture'}};
test('only a matching paid sandbox session can confirm an order', () => {
  assert.equal(confirmsPayment(session,attempt),true);
  for(const patch of [{payment_status:'unpaid'},{payment_status:'no_payment_required'},{livemode:true},{currency:'eur'},{amount_total:1},{id:'other'},{client_reference_id:'other'},{metadata:{orderId:'other'}}]) assert.equal(confirmsPayment({...session,...patch},attempt),false);
  assert.equal(confirmsPayment(session,{...attempt,mode:'live'}),false);
});
test('Stripe signature verification rejects modified payloads and wrong signing secrets', () => {
  const stripe=new Stripe('sk_test_offline_fixture');
  const secret='whsec_offline_fixture';
  const payload=JSON.stringify({id:'evt_fixture',object:'event',type:'checkout.session.completed',data:{object:session}});
  const header=stripe.webhooks.generateTestHeaderString({payload,secret});
  assert.equal(stripe.webhooks.constructEvent(payload,header,secret).id,'evt_fixture');
  assert.throws(()=>stripe.webhooks.constructEvent(payload+' ',header,secret));
  assert.throws(()=>stripe.webhooks.constructEvent(payload,header,'whsec_wrong'));
});
