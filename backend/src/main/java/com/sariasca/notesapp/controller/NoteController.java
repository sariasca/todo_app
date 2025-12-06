package com.sariasca.notesapp.controller;

import com.sariasca.notesapp.model.Note;
import com.sariasca.notesapp.respositories.NoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/notes")
@CrossOrigin(origins = "${connect.frontend}" )
public class NoteController {
    @Autowired
    NoteRepository noteRepository;

    //Obtener toda las notas
    @GetMapping
    public List<Note> getAllNotes () {
        return noteRepository.findAll();
    }
    //Insertar nota
    @PostMapping
    public Note createNote (@RequestBody Note note){
        return noteRepository.save(note);
    }
    //Editar nota
    @PostMapping("/{id}")
    public Note updateNote(@PathVariable Integer id, @RequestBody Note noteDetails){
        Optional<Note> optionalNote = noteRepository.findById(id);

        if(optionalNote.isPresent()){
            Note note = optionalNote.get();
            note.setTitle(noteDetails.getTitle());
            note.setDescription(noteDetails.getDescription());

            return noteRepository.save(note);
        } else {
            return null;
        }
    }

    @DeleteMapping("/{id}")
    public String deleteNote(@PathVariable Integer id, @RequestBody Note noteDetails){
        Optional<Note> optionalNote = noteRepository.findById(id);

        if(optionalNote.isPresent()){
            noteRepository.delete(optionalNote.get());
            return "Nota eliminada correctamente.";
        } else {
            return null;
        }
    }

}
