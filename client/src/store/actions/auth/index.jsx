import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async(formData)=>{
        try{

            console.log("Register user")
            console.log(formData)

            const request = await axios.post('',formData)

            return {data:request.data.user, auth:true}
        }
        catch(error){
            throw error;
        }
    }

)


export const signInUser = createAsyncThunk(
    'auth/signInUser',
    async({email,password})=>{
        try{
            console.log("Login user")
            console.log(email)
            console.log(password)
            const request = await axios.post('',{
               email:email,
               password:password
            })

            return {data:request.data.user, auth:true}
        }
        catch(error){
            throw error;
        }
    }

)