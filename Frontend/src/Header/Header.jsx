import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { useState, useEffect } from "react";
import axios from "axios";
import { updateCurrentUser } from "../store/usernameSlice";

const Header = () => {
   const currentUser =
      useSelector((state) => state.username.username) ||
      localStorage.getItem("username");
   const [allUser, setAllUsers] = useState();
   const [fieldSelect, setFieldSelect] = useState();
   const dispatch = useDispatch();
   
   const data = async () => {
      try {
         const result = await axios.get(
            "http://localhost:3000/api/user/get-users",
            // 'https://daily-rounds-full-dev.vercel.app/api/user/get-users'
            {
               withCredentials: true,
            }
         );

         if (result.status === 200) {
            setAllUsers(result.data.data);
         }
      } catch (err) {
         console.log(err);
         if (err.response.data) {
            toast.error(err.response.data.message);
         }
      }
   };

   useEffect(() => {
      data();
   }, [currentUser]);

   const handleNameChange = (e) => {
      setFieldSelect(e.target.value);
      dispatch(updateCurrentUser(e.target.value));
   };

   return (
      <div className="flex w-full px-6 py-7  bg-white shadow-md justify-between items-center">
         <h1 className="font-bold text-3xl text-gray-900">ToDo List</h1>
         <div className="flex flex-row gap-4">
            <button className="px-6 button py-2">Export</button>
            <select
               className="flex px-6 py-2 justify-center border-gray-500 border-1 bg-gray-100 cursor-pointer items-center rounded-md  outline-0 shadow-md"
               onChange={(e) => handleNameChange(e)}
            >
               <option value={currentUser}>{currentUser}</option>
               {allUser &&
                  allUser.map((item, index) => (
                     <option
                        key={index}
                        value={item.username}
                        className="w-max px-6"
                     >
                        {item.username}
                     </option>
                  ))}
            </select>
         </div>
      </div>
   );
};

export default Header;
