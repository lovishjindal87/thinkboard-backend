import Note from "../models/Note.js"

export async function getAllNotes (_,res) {
    try {
        const notes = await Note.find({ userId: res.locals.userId }).sort({ createdAt: -1 }); // newest first for this user
        res.status(200).json(notes);
    } catch (error) {
        console.error("Error in getAllNotes controller: ", error);
        res.status(500).json({message: "Internal Server Error"});
    }
};

export async function getNoteById (req,res) {
    try {
        const note = await Note.findOne({ _id: req.params.id, userId: res.locals.userId });
        if(!note) return res.status(404).json({Message:"Note not found"});
        res.status(200).json(note);
    } catch (error) {
        console.error("Error in getNoteById controller: ", error);
        res.status(500).json({message: "Internal Server Error"});
    }
};
export async function createNote (req,res) {
    try {
        const {title, content, priority, status, dueDate} = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({ message: "Title is required" });
        }

        const note = new Note({
            title,
            content,
            // if an invalid priority is sent, mongoose will throw a validation error
            // but we still provide a safe fallback here
            priority: ["low", "medium", "high"].includes(priority) ? priority : undefined,
            // same idea for status – fallback lets schema default handle invalid/missing values
            status: ["todo", "in-progress", "done"].includes(status) ? status : undefined,
            dueDate: dueDate || undefined,
            userId: res.locals.userId,
        });

        const savedNote = await note.save();
        res.status(201).json(savedNote);
   } catch (error) {
        console.error("Error in createNote controller: ", error);
        res.status(500).json({message: "Internal Server Error"});

   }
};
export async function updateNote (req,res) {
    try {
        const {title, content, priority, status, dueDate} = req.body;

        const updatePayload = {
            title,
            content,
        };

        if (priority && ["low", "medium", "high"].includes(priority)) {
            updatePayload.priority = priority;
        }

        if (status && ["todo", "in-progress", "done"].includes(status)) {
            updatePayload.status = status;
        }

        if (dueDate !== undefined) {
            updatePayload.dueDate = dueDate || undefined;
        }

        const updatedNote = await Note.findOneAndUpdate(
          { _id: req.params.id, userId: res.locals.userId },
          updatePayload,
          {
            new: true,
          }
        );
        if(!updatedNote) return res.status(404).json({Message:"Note not found"});
        res.status(200).json({message:"Note Updated Successfully!", note: updatedNote});
    } catch (error) {
        console.error("Error in updateNote controller: ", error);
        res.status(500).json({message: "Internal Server Error"});
    }
};
export async function deleteNote (req,res) {
    try {
        const deletedNote = await Note.findOneAndDelete({ _id: req.params.id, userId: res.locals.userId });
        if(!deletedNote) return res.status(404).json({Message:"Note not found"});
        res.status(200).json({message: "Note deleted successfulyy"});
    } catch (error) {
        console.error("Error in deleteNote controller: ", error);
        res.status(500).json({message: "Internal Server Error"});
    }
};