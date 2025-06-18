
<hr>
<h2>Extensions in user.model.js</h2><br>
• I have added two new fields which I think would be good enough to maintain consistency and to avoid many unnecessary future calls<br><br>
• assignedTodos-> is the field that will contain an array of ToDos Id's, WHY ? This is because so that the user can view who has assigned the task to them, and when ever a new todo is created we have an option where we specify the assignedUsers username in an array in Todo.model.js , so I thought if we are adding the users in the assignedUser then the assignedUser should be able to view only those on which it is assigned for, right? I think in that way and which is why I implement that additional functionality, as it was mention that we can extend the functionality accoridng to our choice.<br><br>
• Also the user who creates the Todo shall have the todo ID for index purpose as in this way when I need to get all the todos of a particular user then instead of iterating the whole todo list which might become clumsy after more additions, I am storing the ID's for those todos which that person creates only, Just another addiontal functionlity <br><br>

<hr>
<h2> Extension in auth.controller.js, auth.routes.js</h2>
<br>
• I thought I should have a authentication system as well which Is why I introduce two additonal routes and the routes having two different logic of register and login, I thought it will be easy for me to write code if, I know who the logged user is and appartenly I am storing username along with the user id in the cookie when I logged in a user.

<hr>
<h2> Extension in auth.middleware.js</h2>
<br>
• Added a middleware to check whether the authenic user is making a request or not, I will add the method during each route calls,so that consistency would be maintain and the routes can be assessed only by the authenticated user.

<hr>
<h2>Extension in Todo Routes.js</h2>
• I have included a new route to validate the title as the title must be unique across data, so I have added a new route to validate the title