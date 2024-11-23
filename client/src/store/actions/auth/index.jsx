import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { errorGlobal, successGlobal } from '../../reducers/notifications';

export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async(formData, {dispatch})=>{
        try{

            console.log("Register user")
            console.log(formData)

            const response = await axios.post('',formData)

            if(response){
                localStorage.setItem('token', response.token)
            }

            dispatch(successGlobal('Welcome !!.Check your emails to validate account'))
            return {data:response.data.user, auth:true}
        }
        catch(error){
            dispatch(errorGlobal(error.response.data.message))
            throw error;
        }
    }

)


export const signInUser = createAsyncThunk(
    'auth/signInUser',
    async({email,password}, {dispatch})=>{
        try{
            // console.log("Login user")
            // console.log(email)
            // console.log(password)
            const response = await axios.post('',{
               email:email,
               password:password
            })

            if(response){
                localStorage.setItem('token', response.token)
            }

            dispatch(successGlobal('Welcome !!'))

            return {data:response.data.user, auth:true}
        }
        catch(error){
            dispatch(errorGlobal(error.response.data.message))
            throw error;
        }
    }

)