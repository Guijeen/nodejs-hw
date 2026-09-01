import { Note } from '../models/note.js';
import createHttpError from 'http-errors';

function ifError(note) {
  if (!note) {
    throw createHttpError(404, 'Note not found');
  }
}

export const getAllNotes = async (req, res) => {
  // Отримуємо параметри пагінації
  // і задаємо дефолтні значення
  const { page = 1, perPage = 10, search, tag } = req.query;

  const skip = (page - 1) * perPage;
  const notesQuery = Note.find({ userId: req.user._id });

  // Пошук по частині імені
  if (search) {
    notesQuery.where({
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ],
    });
  }

  if (tag) {
    notesQuery.where('tag').equals(tag);
  }

  // Виконуємо одразу два запити паралельно
  const [totalNotes, notes] = await Promise.all([
    notesQuery.clone().countDocuments(),
    notesQuery.skip(skip).limit(perPage),
  ]);

  // Обчислюємо загальну кількість «сторінок»
  const totalPages = Math.ceil(totalNotes / perPage);

  res.status(200).json({ page, perPage, totalPages, totalNotes, notes });
};

export const getNoteById = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findOne({
    _id: noteId,
    userId: req.user._id,
  });
  ifError(note);
  res.status(200).json(note);
};

export const createNote = async (req, res) => {
  const note = await Note.create({ ...req.body, userId: req.user._id });
  res.status(201).json(note);
};

export const deleteNote = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findOneAndDelete({
    _id: noteId,
    userId: req.user._id,
  });
  ifError(note);
  res.status(200).json(note);
};

export const updateNote = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findOneAndUpdate(
    {
      _id: noteId,
      userId: req.user._id,
    },
    req.body,
    {
      returnDocument: 'after',
    },
  );
  ifError(note);
  res.status(200).json(note);
};
