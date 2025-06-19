import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { z } from "zod";
import axios from 'axios'
import { zodResolver } from "@hookform/resolvers/zod";

const todoSchema = z.object({
   title: z.string().min(3, "Title is too short"),
   description: z.string().min(5, "Description is required"),
   priority: z.enum(["Low", "Medium", "High"]).optional(),
   tags: z.string().optional(),
   assignedUsers: z.array(z.string()).optional(),
});

const AddTodoPopup = ({ onClose, onSubmit}) => {
   const [tags, setTags] = useState();
   const [users, setUsers] = useState([]);
   const [selectedUsers, setSelectedUsers] = useState([]);

   useEffect(() => {
      const fetchUsers = async () => {
         try {
            const res = await axios.get(
               "http://localhost:3000/api/user/get-users",
               // "https://daily-rounds-full-dev.vercel.app/api/user/get-users",
               {
                  withCredentials: true,
               }
            );
            setUsers(res.data.data); 
         } catch (err) {
            console.error("Error fetching users", err);
         }
      };
      fetchUsers();
   }, []);

   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm({
      resolver: zodResolver(todoSchema),
   });

   const handleFinalSubmit = (formData) => {
      const processedTags = tags
         .split(",")
         .map((tag) => tag.trim())
         .filter((tag) => tag.length > 0);

      const finalData = {
         ...formData,
         assignedUsers: selectedUsers,
         tags: processedTags,
      };

      // Send to parent or API
      onSubmit(finalData);
   };
   const handleCheckboxChange = (username) => {
      setSelectedUsers((prev) =>
         prev.includes(username)
            ? prev.filter((user) => user !== username)
            : [...prev, username]
      );
   };

   return (
      <div className="fixed inset-0 bg-white bg-opacity-50 z-50 flex justify-center items-center">
         <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] md:w-[40%] flex flex-col gap-4">
            <h2 className="text-xl font-bold">Add New ToDo</h2>

            <input
               placeholder="Title"
               {...register("title")}
               className="border border-gray-300 p-2 rounded-md"
            />
            {errors.title && (
               <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}

            <textarea
               placeholder="Description"
               {...register("description")}
               className="border border-gray-300 p-2 rounded-md"
            />
            {errors.description && (
               <p className="text-red-500 text-sm">
                  {errors.description.message}
               </p>
            )}

            <div>
               <label className="block font-medium mb-1">Priority</label>
               <select
                  {...register("priority")}
                  className="border border-gray-300 p-2 rounded-md w-full"
                  defaultValue="High"
               >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
               </select>
            </div>

            <div>
               <label className="block font-medium mb-1">Tags</label>
               <div className="flex flex-wrap gap-2">
                  <label className="flex items-center gap-1">
                     <input
                        type="text"
                        placeholder="Enter comma separated tags e.g. coding, management"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        className="border border-gray-300 p-2 rounded-md w-full"
                     />
                  </label>
               </div>
            </div>

            <div>
               <label className="block font-medium mb-1">Assign To Users</label>
               <div className="flex flex-col gap-2 max-h-[150px] overflow-y-auto">
                  {users.map((user) => (
                     <label
                        key={user.username}
                        className="flex items-center gap-2"
                     >
                        <input
                           type="checkbox"
                           value={user.username}
                           checked={selectedUsers.includes(user.username)}
                           onChange={() => handleCheckboxChange(user.username)}
                        />
                        <span>{user.username}</span>
                     </label>
                  ))}
               </div>
            </div>

            <div className="flex justify-end gap-4 mt-4">
               <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-300 text-black rounded-md"
               >
                  Cancel
               </button>
               <button
                  onClick={handleSubmit(handleFinalSubmit)}
                  className="px-4 py-2 bg-black text-white rounded-md"
               >
                  Submit
               </button>
            </div>
         </div>
      </div>
   );
};

export default AddTodoPopup;
