import {z} from 'zod'

export const authValidation = z.object({
    username:z.string().max(10,{message:'username cannot be more than 10 characters'}).min(3,{message:'username shall be atleast of length 3'}),
    email:z.string().email({message:"Invalid Email"}).optional()
})