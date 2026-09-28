import { test, expect } from '@playwright/test';
import { resetAndSeed } from './helpers';

test.beforeEach(async ({ baseURL }) => {
  await resetAndSeed(baseURL!);
});

test('flujo completo: crear, listar, ver, editar y eliminar una nota', async ({ request }) => {
  const created = await request.post('/notes', {
    data: { title: 'Comprar leche', content: 'Descremada' }
  });

  expect(created.status()).toBe(201);
  const note = await created.json();
  expect(note.id).toEqual(expect.any(Number));
  expect(note.title).toBe('Comprar leche');
  expect(note.content).toBe('Descremada');
  expect(note.pinned).toBe(false);
  expect(note.createdAt).toEqual(expect.any(String));
  expect(note.updatedAt).toEqual(expect.any(String));

  const list = await request.get('/notes');

  expect(list.status()).toBe(200);
  const all = await list.json();
  expect(all.map((n: { id: number }) => n.id)).toContain(note.id);
  expect(all).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ title: 'Comprar pan' }),
      expect.objectContaining({ title: 'Llamar al dentista' })
    ])
  );

  const get = await request.get(`/notes/${note.id}`);

  expect(get.status()).toBe(200);
  expect(await get.json()).toMatchObject({
    id: note.id,
    title: 'Comprar leche',
    content: 'Descremada'
  });

  const patched = await request.patch(`/notes/${note.id}`, {
    data: { content: 'Descremada, 2 litros' }
  });

  expect(patched.status()).toBe(200);
  expect(await patched.json()).toMatchObject({
    id: note.id,
    title: 'Comprar leche',
    content: 'Descremada, 2 litros',
    pinned: false
  });

  const afterPatch = await request.get(`/notes/${note.id}`);
  expect((await afterPatch.json()).content).toBe('Descremada, 2 litros');

  const removed = await request.delete(`/notes/${note.id}`);

  expect(removed.status()).toBe(204);

  const afterDelete = await request.get(`/notes/${note.id}`);
  expect(afterDelete.status()).toBe(404);

  const finalList = await request.get('/notes');
  expect((await finalList.json()).map((n: { id: number }) => n.id)).not.toContain(note.id);
});

test('devuelve 404 al pedir una nota que no existe', async ({ request }) => {
  const res = await request.get('/notes/999');

  expect(res.status()).toBe(404);
  expect(await res.json()).toEqual({ error: 'NotFound' });
});
