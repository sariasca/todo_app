package com.sariasca.notesapp.respositories;

import com.sariasca.notesapp.model.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository

public interface NoteRepository extends JpaRepository<Note, Integer> {


}
