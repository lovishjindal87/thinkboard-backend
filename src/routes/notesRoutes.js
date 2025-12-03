import express from "express"
import { getAllNotes, createNote, updateNote, deleteNote, getNoteById } from "../controllers/notesControllers.js"
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// all note routes require authentication
router.use(requireAuth);

router.get("/", getAllNotes);
router.get("/:id", getNoteById);
router.post("/", createNote);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

export default router
