import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import axios from "axios";
import { AddNotePopup } from "./AddNotePopup";

const ToDoAssemble = () => {
   const [showModal, setShowModal] = useState(false);

   const [toDos, setToDo] = useState([]);
   const [totalCount, setTotalCount] = useState();
   const [currentPage, setCurrentPage] = useState(1);
   const [numberOfPages, setNumberOfPages] = useState();
   const [expandedId, setExpandedId] = useState(null);
   const [currentSelectedId, setId] = useState(null);

   const pagination = async () => {
      try {
         const result = await axios.get(
            `http://localhost:3000/api/todos?page=${currentPage}`,
            {
               withCredentials: true,
            }
         );
         const res = result.data;
         toast.success(res.message);
         setToDo(res.data);
         setNumberOfPages(res.pagination.pages);
         setCurrentPage(res.pagination.page);
         setTotalCount(res.pagination.total);
      } catch (err) {
         console.log(err);
         if (err.response.data) {
            toast.error(err.response.data.message);
         }
      }
   };

   useEffect(() => {
      pagination();
   }, [currentPage]);

   const toggleCompletion = async (todoId, currentStatus) => {
      try {
         const result = await axios.patch(
            `http://localhost:3000/api/todos/${todoId}`,
            { completed: !currentStatus },
            {
               headers: {
                  "Content-Type": "application/json",
               },
               withCredentials: true,
            }
         );
         toast.success(result.data.message);
      } catch (err) {
         console.log(err);
         if (err.response.data) {
            toast.error(err.response.data.message);
         }
      }
   };

   const handleDelete = async (todoId) => {
      try {
         const result = await axios.delete(
            `http://localhost:3000/api/todos/${todoId}`,
            {
               withCredentials: true,
            }
         );
         const filteredTodos = toDos.filter((item) => item._id != todoId);
         setToDo(filteredTodos);
         toast.success(result.data.message);
      } catch (err) {
         console.log(err);
         if (err.response.data) {
            toast.error(err.response.data.message);
         }
      }
   };

   const handleAddNote = async (noteContent) => {
      if (!noteContent.trim()) return;
      try {
         const result = await axios.post(
            `http://localhost:3000/api/todos/${currentSelectedId}/notes`,
            {notes:noteContent},
            {
               headers: {
                  "Content-Type": "application/json",
               },
               withCredentials: true,
            }
         );
         toast.success(result.data.message);
         setShowModal(false);
         pagination()
      } catch (err) {
         console.log(err);
         if (err.response?.message) {
            toast.error(err.response.message);
         }
      }
   };

   const createNote = (todoId) => {
      setShowModal(true);
      setId(todoId);
   };
   return (
      <>
         <div className="gap-6  p-4  flex flex-col rounded-md w-full">
            {/* Extraction */}
            {showModal && (
               <AddNotePopup
                  onClose={() => setShowModal(false)}
                  onSave={handleAddNote}
               />
            )}
            <div className="flex flex-col ">
               {toDos.map((item, index) => {
                  const isExpanded = expandedId === item._id;
                  return (
                     <div
                        className={`w-full p-4 rounded-md border-1 border-gray-200 grid grid-cols-12 shadow-xl  mt-3${
                           isExpanded ? "bg-gray-100" : ""
                        }`}
                        key={index}
                     >
                        <input
                           type="checkbox"
                           //    checked={item.completed}
                           onChange={() =>
                              toggleCompletion(item._id, item.completed)
                           }
                           className="col-span-1 w-4 h-4 mx-auto items-center justify-center"
                        />
                        <div
                           className="col-span-8 flex flex-col gap-3 cursor-pointer"
                           onClick={() =>
                              setExpandedId((prev) =>
                                 prev === item._id ? null : item._id
                              )
                           }
                        >
                           <div className=" flex flex-col gap-3 w-full">
                              <p className="font-bold text-lg text-gray-800">
                                 {item.title}
                              </p>
                              {isExpanded && (
                                 <p className="font-normal text-[12px] text-gray-500">
                                    {item.description}
                                 </p>
                              )}
                           </div>
                           <div className=" flex-row flex gap-4">
                              <p
                                 className={`px-4 py-1 font-semibold ${
                                    item.priority === "Low"
                                       ? "bg-amber-300"
                                       : item.priority === "Medium"
                                       ? "bg-blue-300"
                                       : "bg-red-400"
                                 } w-max rounded-full text-[12px]`}
                              >
                                 {item.priority}
                              </p>
                              {item.tags.map((tag, idx) => (
                                 <p
                                    key={idx}
                                    className="px-4 py-1 bg-orange-300 rounded-full text-[12px] w-max font-semibold"
                                 >
                                    {tag}
                                 </p>
                              ))}
                              {item.assignedUsers.map((user, idx) => (
                                 <p
                                    key={idx}
                                    className="px-4 py-1 text-[12px] rounded-full  w-max font-semibold bg-green-400"
                                 >{`@${user}`}</p>
                              ))}
                           </div>
                           {isExpanded && (
                              <div className="flex flex-col gap-2">
                                 <p className="font-bold text-[14px] ">Notes</p>
                                 <div className="flex flex-col pl-5">
                                    {item.notes.map((note, idx) => (
                                       <p
                                          key={idx}
                                          className="text-[12px] font-normal text-gray-500"
                                       >
                                          {idx + 1}
                                          {".  "}
                                          {note.content}
                                       </p>
                                    ))}
                                 </div>
                              </div>
                           )}
                        </div>
                        <div className="col-span-3 p-4 flex flex-row justify-between">
                           <div className=" h-max w-max p-1 bg-white rounded-md border-1 border-gray-100 outline-0 cursor-pointer">
                              <img
                                 src="https://static.vecteezy.com/system/resources/previews/029/722/382/non_2x/notes-icon-in-trendy-flat-style-isolated-on-white-background-notes-silhouette-symbol-for-your-website-design-logo-app-ui-illustration-eps10-free-vector.jpg"
                                 alt="image"
                                 width={20}
                                 height={20}
                                 onClick={() => createNote(item._id)}
                              />
                           </div>
                           <div className=" h-max w-max p-1 bg-white rounded-md border-1 border-gray-100 outline-0 cursor-pointer ">
                              <img
                                 src="https://icons.veryicon.com/png/o/miscellaneous/linear-small-icon/edit-246.png"
                                 alt="image"
                                 width={20}
                                 height={20}
                              />
                           </div>
                           <div
                              className=" h-max w-max p-1 bg-white rounded-md border-1 border-gray-100 outline-0 cursor-pointer"
                              onClick={() => handleDelete(item._id)}
                           >
                              <img
                                 src="https://logowik.com/content/uploads/images/trash-can7871.jpg"
                                 alt="image"
                                 width={25}
                                 height={25}
                              />
                           </div>
                        </div>
                     </div>
                  );
               })}
            </div>
            {/* Pagination */}
            <div className="w-full p-4 border-1 border-gray-200  shadow-xl bg-white grid grid-cols-12  rounded-md">
               <button
                  className={`w-max px-6 cursor-pointer py-2 ${
                     currentPage === 1 ? "text-gray-200" : "text-blue-600"
                  } col-span-2`}
                  disabled={currentPage == 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
               >
                  Previous
               </button>
               <div className="col-span-8 flex items-center justify-center font-medium">
                  {currentPage}/{numberOfPages}
               </div>
               <button
                  className={`w-max px-6 cursor-pointer py-2 font-medium col-span-2 ${
                     currentPage === numberOfPages
                        ? "text-gray-200"
                        : "text-blue-600 "
                  }`}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage == numberOfPages}
               >
                  Next
               </button>
            </div>
         </div>
      </>
   );
};

export default ToDoAssemble;
