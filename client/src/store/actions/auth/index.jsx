import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { errorGlobal, successGlobal } from '../../reducers/notifications';

export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async(formData, {dispatch})=>{
        try{

            console.log("Register user")
            console.log(formData)

            const response = await axios.post('http://localhost:3000/register',formData)

            console.log(response.data)

            dispatch(successGlobal('Welcome !! now You can login to your account'))
            return {data:response.data.user, auth:false}
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
            const response = await axios.post('http://localhost:3000/login',{
               email:email,
               password:password
            })

            if(response){
                localStorage.setItem('token', response.data.token)
            }

            console.log(response.data)

            // dispatch(successGlobal('Welcome !!'))

            return {data:response.data.user, auth:true}
        }
        catch(error){
            // dispatch(errorGlobal(error.response.data.message))
            throw error;
        }
    }

)

export const isAuth = createAsyncThunk(
    'auth/isAuth',
    async()=>{
        try{

            const token = localStorage.getItem("token"); 

            console.log("Retrieved Token auth...:", token);
            if (!token) {
                console.log("No token found!");
                
                return { data:{},auth:false }; 
            }


            const request = await axios.get('http://localhost:3000/verifyRefresh', 
                {
                    headers: {
                      Authorization: `Bearer ${token}`, 
                      "Content-Type": "application/json",
                    },
                }
             );
             console.log('auth res:', request.data)
            return { data:request.data.user, auth:true }
            } 
            catch(error){
                localStorage.removeItem('token')
                return { data:{},auth:false }
            }
    }
)


export const signOut = createAsyncThunk(
    'users/signOut',
    async()=>{
        localStorage.removeItem('token')
    }
)