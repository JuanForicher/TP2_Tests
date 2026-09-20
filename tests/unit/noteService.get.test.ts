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
        const note = service.createNote({title: 'Trabajo Práctico', content: 'Programación IV'});
        expect(note.id).toBeDefined();
        const foundNote = service.getNote(note.id);

        expect(foundNote).toBeDefined();
        expect(foundNote!.title).toBe('Trabajo Práctico');
        expect(foundNote!.content).toBe('Programación IV');
    });

    it('La nota con el id ingresado no existe', () => {
        const note = service.createNote({title: 'Trabajo Práctico', content: 'Programación IV'});

        expect(service.getNote(999)).toBeUndefined();
    })
});