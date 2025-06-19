import {z} from 'zod'

export const registerValidation = z.object({
    username:z.string().max(10,{message:'username cannot be more than 10 characters'}).min(3,{message:'username shall be atleast of length 3'}),
    email:z.string().email({message:"Invalid Email"})
})

export const loginValidation = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(10, "Max 10 characters"),
});