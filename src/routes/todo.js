const express = require("express");
const TodoController = require("../controllers/todo.js")

const router = express.Router();

router.get("/all-todos", TodoController.allTodos)

router.get("/todos-by-user", TodoController.todosByUser)

router.get("/get-todo-by-id/:id", TodoController.getTodoById)

router.post("/add-todo", TodoController.addTodo);

router.put("/update-todo", TodoController.updateTodo);

router.delete("/delete-todo", TodoController.deleteTodo)


module.exports = router;