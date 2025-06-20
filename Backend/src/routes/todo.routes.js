import {Router} from 'express'
import { createToDo, deleteTodos, addNotesToTodo,getSpecficTodo, getToDos, updateTodos, validateTitle, filterByTitle, filterByFilters } from '../controllers/todo.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.route("/filters").get(authMiddleware,filterByFilters) // to filter by the filters

router.route("/validate/:title").get(authMiddleware,validateTitle) // to validate whether the title is unique or not

router.route("/").post(authMiddleware,createToDo) // To create todo

router.route("/:id").patch(authMiddleware,updateTodos) // To update a specific todo

router.route("/:id").delete(authMiddleware,deleteTodos) // To delete a specific todo

router.route("/").get(authMiddleware,getToDos) // To get all the todos

router.route("/:id").get(authMiddleware,getSpecficTodo) // to get a specific todo

router.route("/:id/notes").post(authMiddleware,addNotesToTodo) // to post notes to a specific todo

router.route("/search/filter").get(authMiddleware,filterByTitle) // to filter the search result


export default router   