import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { makeApp } from '../../src/app';

// Test del Ejercicio 4 
describe('Integración - PATCH /notes/:id (Ejercicio 4)', () => {
  it('actualiza solo title, sin tocar content', async () => {
    const app = makeApp(':memory:');
    
    const created = await request(app)
      .post('/notes')
      .send({ title: 'Original', content: 'Contenido' });

    const res = await request(app)
      .patch(`/notes/${created.body.id}`)
      .send({ title: 'Nuevo título' });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Nuevo título');
    expect(res.body.content).toBe('Contenido');
  });

  it('devuelve 404 si el id no existe', async () => {
    const app = makeApp(':memory:');
    const res = await request(app).patch('/notes/999').send({ title: 'X' });
    expect(res.status).toBe(404);
  });
});

// Test del Ejercicio 5 
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