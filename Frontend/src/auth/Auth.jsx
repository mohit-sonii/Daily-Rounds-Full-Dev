import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "react-hot-toast";
import { authValidation } from "../validations/authValidations";

// Both login and register functionality are done at a single place, 

const Auth = () => {
   const [currentPage, setCurrentPage] = useState("register");

   const navigate = useNavigate();

   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm({ resolver: zodResolver(authValidation) });

   useEffect(() => {
      for (const [key, value] of Object.entries(errors)) {
         toast.error(`${key.toUpperCase()} : ${value.message}`);
      }
   }, [errors]);

   const onSubmit = async (data) => {
      const loading = toast.loading("Please Wait...");
      try {
         let registerResult = null;
         if (currentPage === "register") {
            registerResult = await axios.post(
               "http://localhost:3000/api/auth/register",
               data,
               {
                  headers: {
                     "Content-Type": "application/json",
                  },
               }
            );
         } else {
            registerResult = await axios.post(
               "http://localhost:3000/api/auth/login",
               data,
               {
                  headers: {
                     "Content-Type": "application/json",
                  },
               }
            );
         }
         const result = registerResult.data;
         if (result.status === 200) {
            toast.success(result.message);
            navigate("/home");
         }
      } catch (err) {
         console.log(err);
         if (err.response.data) {
            toast.error(err.response.data.message);
         }
      } finally {
         toast.dismiss(loading);
      }
   };

   return (
      <div className="flex justify-center h-screen items-center w-full flex-col gap-8">
         <h4 className="font-bold text-2xl">
            {currentPage === "register" ? "Register" : "Login"} to your account
         </h4>
         <div
            className="flex w-[90%] lg:w-[40%] flex-col gap-6 p-4"
            style={{ border: "0.5px solid gray", borderRadius: "6px" }}
         >
            <form
               onSubmit={handleSubmit(onSubmit)}
               className="flex flex-col justify-between rounded-md gap-6 p-4"
            >
               <input
                  {...register("username")}
                  required={true}
                  defaultValue={""}
                  placeholder="username"
                  className="rounded-md shadow border-0 p-4 outline-0  bg-gray-200 text-black font-semibold text-sm"
               />

               {currentPage === "register" && (
                  <input
                     {...register("email")}
                     required={true}
                     defaultValue={""}
                     placeholder="email"
                     className="rounded-md shadow border-0 p-4 outline-0  bg-gray-200 text-black font-semibold text-sm"
                  />
               )}

               <button className="px-10 py-4 cursor-pointer flex justify-center  hover:bg-gray-700  transition-all ease-in-out items-center rounded-md text-white text-sm font-bold w-max bg-gray-900">
                  {currentPage === "register" ? "Register" : "Login"}
               </button>
            </form>
            <div className="flex self-end text-[12px] text-gray-600">
               {currentPage === "register" ? (
                  <>
                     Already have an account?{" "}
                     <span
                        onClick={() => setCurrentPage("login")}
                        className="font-semibold text-blue-600 cursor-pointer ml-1"
                     >
                        Login
                     </span>
                  </>
               ) : (
                  <>
                     Don't have an account?{" "}
                     <span
                        onClick={() => setCurrentPage("register")}
                        className="font-semibold text-blue-600 cursor-pointer ml-1"
                     >
                        Create One
                     </span>
                  </>
               )}
            </div>
         </div>
      </div>
   );
};

export default Auth;
