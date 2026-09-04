import Note from "../models/Notes.js";
import User from "../models/User.js";

export const getNotes = async (req, res, next) => {
  try {
    const notes = await Note.find({ creator: req.userId }).sort({
      createdAt: -1,
    }); // newest first

    res.status(200).json({
      message: "Notes fetched successfully",
      notes: notes,
    });
  } catch (err) {
    next(err);
  }
};

export const getNoteByID = async (req, res, next) => {
  try {
    const id = req.params.id;

    const note = await Note.findById(id);
    if (!note) {
      const err = new Error("Note not found");
      err.statusCode = 404;
      throw err;
    }
    res.status(200).json({ message: "Note fetched successfully", note: note });
  } catch (err) {
    next(err);
  }
};

export const createNotes = async (req, res, next) => {
  try {
    const title = req.body.title;
    const content = req.body.content;
    const newNote = new Note({
      title: title,
      content: content,
      creator: req.userId,
    });
    await newNote.save();

    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(201).json({
      message: "Note created successfully",
      note: newNote,
      creator: {
        _id: user._id,
        name: user.name,
      },
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const updateNotes = async (req, res, next) => {
  try {
    const noteId = req.params.id;
    const { title, content } = req.body;
    const updatedNote = await Note.findOneAndUpdate(
      {
        _id: noteId,
        creator: req.userId,
      },
      {
        title,
        content,
      },
      {
        new: true,
      },
    );

    if (!updatedNote) {
      const error = new Error("Note not found");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      message: "Note updated successfully",
      note: updatedNote,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteNotes = async (req, res, next) => {
  try {
    const noteId = req.params.id;
    const deletedNote = await Note.findOneAndDelete({
      _id: noteId,
      creator: req.userId,
    });

    if (!deletedNote) {
      const error = new Error("Note not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      message: "Note deleted successfully",
      note: deletedNote,
    });
  } catch (err) {
    next(err);
  }
};
