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


module.exports = {
    getAllNotes
}