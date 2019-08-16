const {db} = require('../utilities/admin');

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
        note: req.body.body,
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

module.exports = {
    getAllNotes,
    postOneNote
}