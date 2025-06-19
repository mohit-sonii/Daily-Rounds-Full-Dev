import ToDoAssemble from "./ToDoAssemble";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import AddTodoPopup from "./AddTodoPopup";

const NewAdditionAndSearch = () => {
   const [showAddModal, setShowAddModal] = useState(false);
   const [alltodos, setAllTodos] = useState([]);
   const [filterField, setFilterField] = useState("");
   const [selectedFilter, setSelectedFilter] = useState([]);

   const handleAddNew = async (form) => {
      try {
         const res = await axios.post(
            // "http://localhost:3000/api/todos",
            "https://daily-rounds-full-dev.vercel.app/api/todos",
            form,
            {
               withCredentials: true,
            }
         );
         toast.success(res.data.message);
         setShowAddModal(false);
      } catch (err) {
         console.log(err);
         toast.error(err.response?.data?.message || "Failed to add ToDo");
      }
   };

   const handleCheckboxChange = (value) => {
      setSelectedFilter((prev) => {
         const newFilter =  prev.includes(value)
            ? prev.filter((item) => item !== value)
            : [...prev, value];

         filterByFilters(newFilter)
         return newFilter
      });
   };

   const filterBySearch = async () => {
      try {
         const res = await axios.get(
            // `http://localhost:3000/api/todos/search/filter?title=${filterField}`,
            `https://daily-rounds-full-dev.vercel.app/api/todos/search/filter?title=${filterField}`,
            {
               withCredentials: true,
            }
         );
         toast.success(res.data.message);
         setAllTodos(res.data.data);
      } catch (err) {
         console.log(err);
         return;
      }
   };
   
   const filterByFilters = async (customFilter=selectedFilter) => {
      try {
         const priorityFilters = customFilter.filter((item) =>
            ["High", "Medium", "Low"].includes(item)
         );
         const tagFilters = customFilter.filter((item) =>
            ["Coding", "Management", "Games", "Communication"].includes(item)
         );

         const queryParams = new URLSearchParams();
         if (priorityFilters.length)
            queryParams.append("priority", priorityFilters.join(","));
         if (tagFilters.length)
            queryParams.append("tags", tagFilters.join(","));


         const res = await axios.get(
            // `http://localhost:3000/api/todos/filters?${queryParams.toString()}`,
            `https://daily-rounds-full-dev.vercel.app/api/todos/filters?${queryParams.toString()}`,
            {
               withCredentials: true,
            }
         );

         toast.success(res.data.message);
         setAllTodos(res.data.data);
      } catch (err) {
         console.log(err);
         toast.error("Failed to filter todos");
      }
   };

   return (
      <>
         <div className="w-[20%] p-6 gap-6 flex flex-col bg-white rounded-sm shadow-2xl">
            {showAddModal && (
               <AddTodoPopup
                  onClose={() => setShowAddModal(false)}
                  onSubmit={handleAddNew}
               />
            )}
            <p className="font-bold text-xl">Filters</p>
            <div className=" flex justify-center flex-col gap-3">
               <p className="font-bold text-md">Priority</p>
               <div className="flex flex-row gap-3">
                  <input
                     type="checkbox"
                     value="High"
                     name="High"
                     onChange={() => handleCheckboxChange("High")}
                  />
                  <label htmlFor="High" className="font-medium">
                     High
                  </label>
               </div>
               <div className="flex flex-row gap-3">
                  <input
                     type="checkbox"
                     value="Medium"
                     name="Medium"
                     onChange={() => handleCheckboxChange("Medium")}
                  />
                  <label htmlFor="Medium" className="font-medium">
                     Medium
                  </label>
               </div>
               <div className="flex flex-row gap-3">
                  <input
                     type="checkbox"
                     value="Low"
                     name="Low"
                     onChange={() => handleCheckboxChange("Low")}
                  />
                  <label htmlFor="Low" className="font-medium">
                     Low
                  </label>
               </div>
            </div>
            <div className="flex justify-center flex-col gap-3">
               <p className="font-bold text-md">Tags</p>
               <div className="w-full flex flex-row gap-4 ">
                  <div className="flex flex-row gap-3">
                     <input
                        type="checkbox"
                        value="Coding"
                        name="Coding"
                        onChange={() => handleCheckboxChange("Coding")}
                     />
                     <label htmlFor="Coding" className="font-medium">
                        Coding
                     </label>
                  </div>
                  <div className="flex flex-row gap-3">
                     <input
                        type="checkbox"
                        value="Management"
                        name="Management"
                        onChange={() => handleCheckboxChange("Management")}
                     />
                     <label htmlFor="Management" className="font-medium">
                        Management
                     </label>
                  </div>
                  <div className="flex flex-row gap-3">
                     <input
                        type="checkbox"
                        value="Games"
                        name="Games"
                        onChange={() => handleCheckboxChange("Games")}
                     />
                     <label htmlFor="Games" className="font-medium">
                        Games
                     </label>
                  </div>
                  <div className="flex flex-row gap-3">
                     <input
                        onChange={() => handleCheckboxChange("Communication")}
                        type="checkbox"
                        value="Communication"
                        name="Communication"
                     />
                     <label htmlFor="Communication" className="font-medium">
                        Communication
                     </label>
                  </div>
               </div>
            </div>
         </div>
         <div className="w-[75%] flex flex-col gap-5  ">
            <div className="w-full flex flex-row gap-[10%]">
               <div className="w-[30%] flex ">
                  <div
                     className="flex px-6 py-2 h-max cursor-pointer  bg-gray-100 text-[12px] shadow-lg font-medium w-max rounded-md "
                     onClick={() => setShowAddModal(true)}
                  >
                     + New Todo
                  </div>
               </div>
               <div className="w-[60%] flex flex-row gap-3 h-max justify-end">
                  <input
                     type="text"
                     value={filterField}
                     onChange={(e) => setFilterField(e.target.value)}
                     className="w-[80%] h-max p-2 rounded-md font-semibold text-gray-600 bg-white border-1 border-gray-200 text-md outline-0 text-[12px]"
                     placeholder="Search by title..."
                  />
                  <div
                     className=" h-max w-max p-1 bg-white rounded-md border-1 border-gray-100 outline-0"
                     onClick={filterBySearch}
                  >
                     <img
                        src="https://endlessicons.com/wp-content/uploads/2015/08/search-icon-2-614x460.png"
                        alt="image"
                        width={30}
                        height={30}
                     />
                  </div>
               </div>
            </div>
            <ToDoAssemble alltodos={alltodos} />
         </div>
      </>
   );
};

export default NewAdditionAndSearch;
