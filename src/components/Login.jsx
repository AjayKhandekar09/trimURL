import React, { useEffect, useState } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Input } from './ui/input'
import { Button } from './ui/button'
import { BeatLoader } from 'react-spinners'
import Error from './Error.jsx'
import * as Yup from "yup"
import { login } from '@/db/apiAuth'
import useFetch from '@/hooks/useFetch'
import { useSearchParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { UrlState } from '@/contextApi'
  
function Login() {
    const [errors , setErrors] = useState([])
    const [formData , setFormdata] = useState({
        email:"",
        password: ""
    })
    const handleInputChange = (e) => {
        const {name , value} = e.target
        setFormdata((prevState) => ({
            ...prevState,
            [name] : value,
        }))
    }
    const {data ,loading , error , fn : fnLogin} = useFetch(login , formData)
//Error handling mechanism
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const longLink = searchParams.get("createNew");
    const {fetchUser} = UrlState()
    useEffect(() => {

        console.log(data);
        if(error === null && data) {
            navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`)
            fetchUser()
        }
        
    }, [error, data])
    const handleLogin = async () => {
        setErrors([])

        try {
            const schema = Yup.object().shape({
                email:Yup.string().email('Invalid email address').required('Email is required'),
                password : Yup.string().min(6,'Password must be of 6 characters').required("Password is required")
            })
            await schema.validate(formData , {abortEarly: false});
            await fnLogin()
            
        } catch (e) {
            const newErrors = {}

            e?.inner?.forEach((err) => {
                newErrors[err.path] = err.message
            })

            setErrors(newErrors)
        }
    }
  return (
    
        <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              { error && <Error message={error.message} />}
            </CardHeader>
            <CardContent className = "space-y-2">
                <div className='space-y-2'>
                    <Input onChange={handleInputChange} type='email' name='email' placeholder='Enter your Email' />
                    {errors.email && <Error message={errors.email} />}
                </div>
                <div className='space-y-2'>
                    <Input onChange={handleInputChange} type='password' name='password' placeholder='password' />
                    {errors.password && <Error message={errors.password} />}

                </div>
              
            </CardContent>
            <CardFooter>
                <Button  onClick={handleLogin}> {loading ? <BeatLoader size={10} color='white' /> : "Login" }</Button>
            </CardFooter>
        </Card>

    
  )
}

export default Login