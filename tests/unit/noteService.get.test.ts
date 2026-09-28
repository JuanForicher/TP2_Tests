import { describe, it, expect, beforeEach } from 'vitest';
import { NoteServiceImpl } from '../../src/services/NoteService';
import { SqliteNoteRepository } from '../../src/repositories/NoteRepository';
import { createDb } from '../../src/db/connection';

describe('NoteService - getNote (Ejercicio 3)', () => {
    let service: NoteServiceImpl;

    beforeEach(() => {
        const db = createDb(':memory:');
        const repo = new SqliteNoteRepository(db);
        service = new NoteServiceImpl(repo);
    });

    it('Devuelve la nota correspondiente al id', () => {
        const note = service.createNote({ title: 'Trabajo Práctico', content: 'Programación IV' });

        const foundNote = service.getNote(note.id);

        expect(foundNote).toEqual(note);
    });

    it('Devuelve la nota correcta entre varias', () => {
        const primera = service.createNote({ title: 'Comprar pan', content: 'Antes de las 20hs' });
        const segunda = service.createNote({ title: 'Llamar al dentista', content: 'Turno de control' });
        const tercera = service.createNote({ title: 'Pagar cuota TUP', content: 'Antes del 10 de Octubre' });

        expect(service.getNote(primera.id)).toEqual(primera);
        expect(service.getNote(segunda.id)).toEqual(segunda);
        expect(service.getNote(tercera.id)).toEqual(tercera);
    });

    it('La nota con el id ingresado no existe', () => {
        service.createNote({ title: 'Trabajo Práctico', content: 'Programación IV' });
        expect(service.listNotes()).toHaveLength(1);

        expect(service.getNote(999)).toBeUndefined();
    });
});
