const {db, admin, FieldValue} = require('../utilities/admin');

const getAllNotes = (req, res) => {
    db.collection('notes')
        .orderBy('createdAt', 'desc')
        .get()
        .then(noteCollection => {
            let notes = [];
            noteCollection.forEach(doc => {
                notes.push({
                    noteId: doc.id,
                    body: doc.data().body,
                    userHandle : doc.data().userHandle,
                    createdAt : doc.data().createdAt
                });
            });
            return res.json(notes);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({errros : err.code});
        })
}

const postOneNote = (req, res) => {
    /** req.user.handle contains the handle */
    if (req.body.body.trim() === '')
        return res.status(400).json({ body : 'Your note must not be empty'});
    
    const newNote = {
        body: req.body.body,
        userHandle : req.user.handle,
        createdAt : new Date().toISOString()
    };

    db.collection('notes')
        .add(newNote)
        .then(addedNote => {
            return res.status(200).json({ message : `document ${addedNote.id} was created successfully`})
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({error: 'something went wrong'})
        })
}

const deleteOneNote = (req, res) => {
    const noteDocument = db.doc(`/notes/${req.params.noteId}`);
    
    noteDocument.get()
        .then(noteToDelete => {
            if(!noteToDelete.exists)
                return res.status(400).json({error : 'Note not found'})
            else
                return noteDocument.delete();
        })
        .then(() => {
            res.json({ message : 'Note was succeddfully deleted'});
        })
        .catch(err => { 
            console.log(err);
            return res.status(500).json({error: err.code});

        })
}

const updateOneNote = (req, res) => {
    if (req.body.body.trim() === '')
        return res.status(400).json({ body : 'Your edited note must not be empty'});
    
    let editNoteDocument = db.doc(`/notes/${req.params.noteId}`);


    editNoteDocument.get()
        .then(noteToEdit => {
            if(!noteToEdit.exists)
                return res.status(400).json({ error: "Note to edit not found"})
            else 
                editNoteDocument.update({ 
                    body : req.body.body,
                    editedAt : new Date().toISOString()
                });

                return res.status(200).json({ message : `document ${noteToEdit.id} was edited`})
        })
        .catch(err =>{
            console.log(err);
            return res.status(500).json({ error : err.code });
        })
}
module.exports = {
    getAllNotes,
    postOneNote,
    deleteOneNote,
    updateOneNote
}
