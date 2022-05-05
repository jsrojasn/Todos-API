const mongoose = require("mongoose");
const Todo = require("../models/todo");

exports.allTodos = async (req, res, next) => {
  try {
    const todos = await Todo.find();
    return res.status(200).json(todos);
  } catch (error) {
    return res.status(500).json({
      error: "Error returning Todos",
    });
  }
};

exports.todosByUser = async (req, res, next) => {
  try {
    const todos = await Todo.find({ owner: req.userData.userId }).sort({
      updatedAt: -1,
    });
    return res.status(200).json(todos);
  } catch (error) {
    return res.status(500).json({
      error: "Error returning Todos by user",
    });
  }
};

exports.getTodoById = async (req, res, next) => {
  try {
    if (!req.params.id) throw new Error();
    const todos = await Todo.findById(req.params.id);
    return res.status(200).json(todos);
  } catch (error) {
    return res.status(500).json({
      error: "Error returning Todo by ID",
    });
  }
};

exports.addTodo = async (req, res, next) => {
  try {
    const { title } = req.body;
    if (!title) throw new Error();
    const newTodo = new Todo({
      title,
      owner: mongoose.Types.ObjectId(req.userData.userId),
    });
    const savedTodo = await newTodo.save();
    return res.status(201).json({
      message: "Created Todo successfully",
      todo: savedTodo,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Error creating Todo",
    });
  }
};

exports.updateTodo = async (req, res, next) => {
  try {
    const { id, title } = req.body;
    if (!id || !title) throw new Error();
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { title },
      { new: true }
    );
    return res.status(201).json({
      message: "Updated Todo successfully",
      todo: updatedTodo,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Error updating Todo",
    });
  }
};

exports.deleteTodo = async (req, res, next) => {
  try {
    const { id } = req.body;
    if (!id) throw new Error();
    await Todo.deleteOne({ _id: id });
    return res.status(201).json({
      message: "Deleted Todo successfully",
      todo: {
        id,
      },
    });
  } catch (error) {
    return res.status(500).json({
      error: "Error deleting Todo",
    });
  }
};
