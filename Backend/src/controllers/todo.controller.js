import { ToDo } from "../models/todo.model.js";
import { User } from "../models/user.model.js";

// this method is responsible for validating the title for a todo,  as the title must be unique across the data
export const validateTitle = async (req, res) => {
   try {
      const title = req.params.title;
      const fetchByTitle = await ToDo.findOne({ title });
      if (fetchByTitle) {
         res.status(409).json({
            status: 409,
            message: "A Task with this Title already exists",
         });
         return;
      }
      res.status(200).json({ status: 200, message: "Title is unique" });
      return;
   } catch (err) {
      console.log(err);
      res.status(500).json({
         status: 500,
         message: "Error while fetching the ToDo with Title",
      });
      return;
   }
};

// this method will be responsible to create a todo and store it in the database, it's purpose is not only to accept the fields from the body and store it in the db but also to keep track of the data efficiently, the thing is that the user who created the todo shall have a todo field in their data, so that they know what todo they submit, and there is also a field of assignedUser in the user model so I am making sure that the assinged user shall also recieve the todo id in their model, so which is why this method allows to add the todo along with the changes in the current user data and the assigned todo user db
export const createToDo = async (req, res) => {
   try {
      // I am pretty sure the necessary data will be in the rest as React hhook form from the frontend will handle that
      const userId = req.id;

      const { ...rest } = req.body;
      const dataProvided = {};
      dataProvided.user = userId;
      dataProvided.title = rest.title;
      dataProvided.description = rest.description;
      if (rest.priority) dataProvided.priority = rest.priority;
      if (rest.tags && rest.tags.length != 0) dataProvided.tags = rest.tags;

      if (rest.assignedUsers && rest.assignedUsers.length != 0)
         dataProvided.assignedUsers = rest.assignedUsers;

      const newToDo = await ToDo.create(dataProvided);

      const usernames = rest.assignedUsers;
      usernames.map(async (name) => {
         const getUser = await User.findOne({ username: name });
         getUser.assignedToDos.push(newToDo._id);
         getUser.save();
         return;
      });
      const currentUser = await User.findById(userId);
      currentUser.todos.push(newToDo._id);
      currentUser.save();

      res.status(201).json({
         status: 201,
         message: "Todo Added to list",
         data: newToDo,
      });
      return;
   } catch (err) {
      console.log(err);
      res.status(500).json({
         status: 500,
         message: "Error while Creating a Todo",
      });
      return;
   }
};

// this method will accept the entries that needs to be change and will update all of them in the respective Todo ana first it is accepting the todo Id in the params.
export const updateTodos = async (req, res) => {
   try {
      const todoId = req.params.id;
      const { ...rest } = req.body;
      await ToDo.findByIdAndUpdate(todoId, rest);
      res.status(200).json({
         status: 200,
         message: "Data updated successfully",
      });
      return;
   } catch (err) {
      console.log(err);
      res.status(500).json({
         status: 500,
         message: "Error while Updating a Todo",
      });
   }
};

// it will send all the todos to the user
export const getToDos = async (req, res) => {
   try {
      // /api/todos?status=completed&priority=high&page=2
      let { page = 1, limit = 5 } = req.query;

      page = parseInt(page);
      const userId = req.id;
      limit = parseInt(limit);
      const skip = (page - 1) * limit;
      const user = await User.findById(userId);

      // Fetch filtered + paginated todos
      const allToDos = await ToDo.find({ assignedUsers: user.username })
         .skip(skip)
         .limit(limit);

      const totalCount = await ToDo.countDocuments({
         assignedUsers: user.username,
      });

      res.status(200).json({
         status: 200,
         message: "Data Fetched Successfully",
         data: allToDos,
         pagination: {
            total: totalCount,
            page,
            pages: Math.ceil(totalCount / limit),
            limit,
         },
      });
      return;
   } catch (err) {
      console.log(err);
      res.status(500).json({
         status: 500,
         message: "Error while Getting a Todo",
      });
   }
};

// this will delete the todo with mentioned ID, the changes done in the todo will reflect the changes in the currentUser and the user whom the todo is assigned
export const deleteTodos = async (req, res) => {
   try {
      const userId = req.id;
      const todoId = req.params.id;
      const currentUser = await User.findById(userId);
      try {
         const todo = await ToDo.findById(todoId);
         for (const user of todo.assignedUsers) {
            const assignedUser = await User.findOne({ username: user });
            const filterTodoForAssignedUser = assignedUser.assignedToDos.filter(
               (id) => id != todoId
            );
            assignedUser.assignedToDos = filterTodoForAssignedUser;
            assignedUser.save();
         }
         res.status(200).json({
            status: 200,
            message: "Data Deleted Successfully",
         });
         return;
      } catch (err) {
         console.log(err);
         res.status(404).json({
            status: 404,
            message: "Todo Not found with this ID",
         });
         return;
      }

      // try {
      //     const filterTodos = currentUser.todos.filter((item) => item != todoId);
      //     currentUser.todos = filterTodos;
      //     currentUser.save();
      // } catch (err) {
      //     console.log(err);
      //     res.status(500).json({
      //         status: 500,
      //         message: "Error while making changes in database",
      //     });
      //     return;
      // }
   } catch (err) {
      console.log(err);
      res.status(500).json({
         status: 500,
         message: "Error while Deleting a Todo",
      });
      return;
   }
};

// method to get a specific todo  and the id will be taken from the params.
export const getSpecficTodo = async (req, res) => {
   try {
      const todoId = req.params.id;
      const result = await ToDo.findById(todoId);
      if (!result) {
         res.status(404).json({
            status: 404,
            message: "Todo With this ID does not found",
         });
         return;
      }
      res.status(200).json({
         status: 200,
         message: "Data Fetched Successfully",
         data: result,
      });
      return;
   } catch (err) {
      console.log(err);
      res.status(500).json({
         status: 500,
         message: "Error while Fetching a Todo",
      });
   }
};

// To add the notes in the todos field i need ot create a seperate method and route for that, and for that I am accpeting the ntoes data from the body and the id from the params, then I push that notes in the dedicated Todo.
export const addNotesToTodo = async (req, res) => {
   try {
      const { notes } = req.body;
      const todoId = req.params.id;

      const todoData = await ToDo.findById(todoId);
      if (!todoData) {
         res.status(404).json({ status: 404, message: "Todo not found" });
         return;
      }
      const newNote = {
         content: notes,
         createdAt: Date.now(),
      };

      todoData.notes.push(newNote);
      await todoData.save();

      res.status(200).json({
         status: 200,
         message: "Notes Created Successfully",
      });
      return;
   } catch (err) {
      console.log(err);
      res.status(500).json({
         status: 500,
         message: "Error while Fetching a Todo",
      });
   }
};

export const filterByTitle = async (req, res) => {
   try {
      const { title } = req.query;
      const currentId = req.id;
      const user = await User.findById(currentId);

      // should be done on the assigned users todo list,not to all
      const query = {
         assignedUsers: user.username,
      };

      if (title) {
         query.title = { $regex: title, $options: "i" };
      }

      const todos = await ToDo.find(query);
      res.status(200).json({
         status: 200,
         message: "Todo fetched successfully",
         data: todos,
      });
      return;
   } catch (err) {
      console.log(err);
      res.status(500).json({ status: 500, message: "Internal Server Error" });
      return;
   }
};

export const filterByFilters = async (req, res) => {
   try {
      const userId = req.id;
      const { priority, tags } = req.query;

      const user = await User.findById(userId);
      if (!user) {
         return res
            .status(404)
            .json({ status: 404, message: "User not found" });
      }

      const query = {
         assignedUsers: user.username,
      };

      if (priority) {
         // For multiple priority values: e.g., priority=high,low
         const priorities = priority.split(",");
         query.priority = { $in: priorities };
      }

      if (tags) {
         // For multiple tags: e.g., tags=coding,games
         const tagsArray = tags.split(",");
         query.tags = { $in: tagsArray };
      }

      const filteredTodos = await ToDo.find(query);
      res.status(200).json({
         status: 200,
         message: "Data Filtered Successfully",
         data: filteredTodos,
      });
      return;
   } catch (err) {
      console.log(err);
      res.status(500).json({ status: 500, message: "Internal Server Erorr" });
      return;
   }
};
