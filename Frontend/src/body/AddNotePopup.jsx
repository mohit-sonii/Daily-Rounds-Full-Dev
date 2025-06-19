import React, { useState } from "react";

export const AddNotePopup = ({ onClose, onSave }) => {
   const [note, setNote] = useState("");

   return (
      <div className="fixed inset-0 bg-white bg-opacity-40 flex items-center justify-center z-50">
         <div className="bg-white  w-[90%] md:w-[400px] p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-4 text-center">Add a Note</h2>
            <textarea
               value={note}
               onChange={(e) => setNote(e.target.value)}
               placeholder="Type your note here..."
               className="w-full p-3 border border-gray-300 rounded-md mb-4 resize-none"
               rows={4}
            />
            <div className="flex justify-between">
               <button
                  onClick={() => onSave(note)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
               >
                  Add Note
               </button>
               <button
                  onClick={onClose}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
               >
                  Cancel
               </button>
            </div>
         </div>
      </div>
   );
};
