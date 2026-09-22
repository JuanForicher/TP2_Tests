import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { makeApp } from '../../src/app';

describe('Integración - DELETE /notes/:id (Ejercicio 5)', () => {
  it('elimina una nota existente y responde 204', async () => {
    const app = makeApp(':memory:');

    const created = await request(app)
      .post('/notes')
      .send({ title: 'A', content: 'B' });

    const res = await request(app).delete(`/notes/${created.body.id}`);

    expect(res.status).toBe(204);
  });

  it('devuelve 404 si el id no existe', async () => {
    const app = makeApp(':memory:');
    const res = await request(app).delete('/notes/999');
    expect(res.status).toBe(404);
  });
});