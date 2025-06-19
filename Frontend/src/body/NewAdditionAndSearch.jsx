import ToDoAssemble from "./ToDoAssemble";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import AddTodoPopup from "./AddTodoPopup";

const NewAdditionAndSearch = () => {
   const [showAddModal, setShowAddModal] = useState(false);
   const [alltodos,setAllTodos] =useState([])
   const [filterField,setFilterField] = useState("")

   const handleAddNew = async (form) => {
      try {
         const res = await axios.post(
            "http://localhost:3000/api/todos"
            // "https://daily-rounds-full-dev.vercel.app/api/todos"
            , form, {
            withCredentials: true,
         });
         toast.success(res.data.message);
         setShowAddModal(false);
      } catch (err) {
         console.log(err)
         toast.error(err.response?.data?.message || "Failed to add ToDo");
      }
   };

   const filterBySearch=async()=>{
      try{
         const res =await axios.get(
            `http://localhost:3000/api/todos/search/filter?title=${filterField}`,
            // `https://daily-rounds-full-dev.vercel.app/api/todos/search/filter?title=${filterField}`,
            {
               withCredentials:true
            }
         )
         toast.success(res.data.message)
         setAllTodos(res.data.data)
      }catch(err){
         console.log(err)
         return
      }
   }
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
                  <input type="checkbox" value="high" name="high" />
                  <label htmlFor="high" className="font-medium">
                     High
                  </label>
               </div>
               <div className="flex flex-row gap-3">
                  <input type="checkbox" value="medium" name="medium" />
                  <label htmlFor="medium" className="font-medium">
                     Medium
                  </label>
               </div>
               <div className="flex flex-row gap-3">
                  <input type="checkbox" value="low" name="low" />
                  <label htmlFor="low" className="font-medium">
                     Low
                  </label>
               </div>
            </div>
            <div className="flex justify-center flex-col gap-3">
               <p className="font-bold text-md">Tags</p>
               <div className="w-full flex flex-row gap-4 ">
                  <div className="flex flex-row gap-3">
                     <input type="checkbox" value="coding" name="coding" />
                     <label htmlFor="coding" className="font-medium">
                        Coding
                     </label>
                  </div>
                  <div className="flex flex-row gap-3">
                     <input
                        type="checkbox"
                        value="management"
                        name="management"
                     />
                     <label htmlFor="management" className="font-medium">
                        Management
                     </label>
                  </div>
                  <div className="flex flex-row gap-3">
                     <input type="checkbox" value="games" name="games" />
                     <label htmlFor="games" className="font-medium">
                        Games
                     </label>
                  </div>
                  <div className="flex flex-row gap-3">
                     <input
                        type="checkbox"
                        value="communication"
                        name="communication"
                     />
                     <label htmlFor="communication" className="font-medium">
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
                     onChange={(e)=>setFilterField(e.target.value)}
                     className="w-[80%] h-max p-2 rounded-md font-semibold text-gray-600 bg-white border-1 border-gray-200 text-md outline-0 text-[12px]"
                     placeholder="Search by title..."
                  />
                  <div className=" h-max w-max p-1 bg-white rounded-md border-1 border-gray-100 outline-0" onClick={filterBySearch}>
                     <img
                        src="https://endlessicons.com/wp-content/uploads/2015/08/search-icon-2-614x460.png"
                        alt="image"
                        width={30}
                        height={30}
                     />
                  </div>
               </div>
            </div>
            <ToDoAssemble alltodos={alltodos}/>
         </div>
      </>
   );
};

export default NewAdditionAndSearch;
