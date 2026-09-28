import { describe, it, expect, beforeEach } from 'vitest';
import { NoteServiceImpl } from '../../src/services/NoteService';
import { SqliteNoteRepository } from '../../src/repositories/NoteRepository';
import { createDb } from '../../src/db/connection';

describe('NoteService - listNotes (Ejercicio 2)', () => {
    let service: NoteServiceImpl;

    beforeEach(() => {
        const db = createDb(':memory:');
        const repo = new SqliteNoteRepository(db);
        service = new NoteServiceImpl(repo);
    });

    it('devuelve una lista vacía cuando no hay notas', () => {
        expect(service.listNotes()).toEqual([]);
    });

    it('devuelve la lista de notas', () => {
        const note1 = service.createNote({ title: 'Comprar pan', content: 'Antes de las 20hs' });
        const note2 = service.createNote({ title: 'Comprar Jugo', content: 'Antes de las 21hs' });
        expect(service.listNotes()).toEqual([note1,note2]);
    });

    it('Verifica que la cantidad sea la correcta', () => {
        service.createNote({ title: 'Comprar huevos', content: 'Antes de las 16hs' });
        service.createNote({ title: 'Pagar cuota TUP', content: 'Antes del 10 de Octubre' });
        expect(service.listNotes()).toHaveLength(2);
    });

})