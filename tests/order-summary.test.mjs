import test from 'node:test';
import assert from 'node:assert/strict';
import { collectedTotal, isCancelledOrder, isTestOrder } from '../lib/order-summary.ts';
test('unpaid, cancelled and refunded orders are not revenue', () => {
  assert.equal(collectedTotal([
    {status:'Pendiente',paymentStatus:'Pendiente',total:4.99},
    {status:'Cancelado',paymentStatus:'Pagado',total:4.99},
    {status:'Entregado',paymentStatus:'Reembolsado',total:4.99},
    {status:'Entregado',paymentStatus:'Pagado',total:4.99},
  ]),4.99);
});
test('payment aggregation uses cents and ignores invalid amounts', () => {
  assert.equal(collectedTotal([{paymentStatus:'paid',total:0.1},{paymentStatus:'paid',total:0.2},{paymentStatus:'paid',total:NaN},{paymentStatus:'paid',total:-5}]),0.3);
});
test('cancelled or rejected orders are excluded regardless of language', () => {
  for (const status of [' Cancelado ','Cancelada','cancelled','canceled','Rechazado','rejected']) assert.equal(isCancelledOrder({status}),true);
  assert.equal(isCancelledOrder({status:'Confirmado'}),false);
});
test('sandbox orders cannot count as revenue even if their status is changed', () => {
  const order={status:'Entregado',paymentStatus:'Pagado',total:499,paymentMode:'test'};
  assert.equal(isTestOrder(order),true);
  assert.equal(collectedTotal([order]),0);
  assert.equal(collectedTotal([{...order,paymentMode:undefined,source:'website-stripe-test'}]),0);
  assert.equal(isTestOrder({source:'website'}),false);
});
