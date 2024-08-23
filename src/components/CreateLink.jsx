import React, { useRef } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  import { DialogFooter } from '@/components/ui/dialog';
  import { QRCode } from 'react-qrcode-logo';
import useFetch from '@/hooks/useFetch';
import { UrlState } from '@/contextApi';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card } from './ui/card';
import * as yup from "yup"
import { useState } from 'react';
// import { QrCode } from 'lucide-react';
import { createUrls } from '@/db/apiUrl';
import Error from './Error';
function CreateLink() {
    const {user} = UrlState()
    const navigate = useNavigate()
    let [searchParams , setSearchParams] = useSearchParams()
    const longLink = searchParams.get("createNew");
    const [errors , setErrors] = useState({})
    const ref = useRef()
    // const [newErrors , setNewErrors] = useState([])
    // const []
    const [formValues , setFormValues] = useState({
        title: "",
        original_url : longLink ? longLink : "",
        custom_url : "",
    })

    const schema =  yup.object().shape({
        title: yup.string().required("Title is required"),
        original_url: yup.string()
        .url("Must be a valid URL")
        .required("URL is required"),
        custom_url: yup.string()
    })

    const handleChange = (e) => {
        setFormValues({
            ...formValues,
            [e.target.id]: e.target.value,
        })
    }

        const {fn: fnCreateLink , loading , error,data } = useFetch(createUrls , {...formValues , user_id : user.id})

        const createNewLink = async () => {
            setErrors([]);
            console.log("etered in createNewLink");
            
            
            try {
                await schema.validate(formValues , {abortEarly: false})
                // await new Promise((resolve) => setTimeout(resolve, 1000));
                console.log("entered in await 1");
                console.log(formValues);
                
                // console.log(ref.current);  // Check if ref.current is defined
                // if (!ref.current) {
                //     console.error("ref.current is null or undefined");
                //     return;
                // }

                // console.log(ref.current.canvasRef.current);  // Check if canvasRef is accessible
                // if (!ref.current.canvasRef || !ref.current.canvasRef.current) {
                //     console.error("canvasRef.current is null or undefined");
                //     return;
                // }
                // const canvasi = document.querySelector("canvas");  // Access canvas via DOM
                // console.log(canvasi);
                const canvas = ref.current.canvasRef.current;
                const qr = await new Promise((resolve) => canvas.toBlob(resolve))
                // console.log(qr);
                
                 await fnCreateLink(qr)
                console.log("etered in await 3");
            } catch (error) {
                const newErrors = {}

                error?.inner?.forEach((err) => {
                    newErrors[err.path] = err.message
                })

                setErrors(newErrors)
            }
        }

  return (
        <Dialog defaultOpen={longLink}
        onOpenChange={(res) => {
          if (!res) setSearchParams({});
        }}>
            <DialogTrigger asChild>
                <Button>
                    Create New Links
                </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-md'>
              <DialogHeader>
                {formValues?.original_url && <QRCode values={formValues?.original_url} size={250} ref={ref} />}
                <DialogTitle className='font-bold text-2xl' >Create New</DialogTitle>
                <Input type='text' id='title' value={formValues.title} onChange={handleChange} placeholder="Trimmed Link's Title"  />
                {errors.title && <Error message={errors.title}/>}
                <Input type='text' id='original_url' value={formValues.original_url} onChange={handleChange} placeholder="Enter your long URL"/>
                {errors.original_url && <Error message={errors.original_url}/>}
                <div className='flex items-center gap-2'>
                    <Card className="p-2">trimURL.in</Card>/
                    <Input type='text' id='custom_url' value={formValues.custom_url} onChange={handleChange} placeholder="Custom Link (optional)"/>
                    
                </div>
                
              </DialogHeader>
              {error && <Error message={error.message}/>}
              <DialogFooter className='sm:justify-between'>
                <Button disabled={loading} onClick={createNewLink} type="submit">Create</Button>
            </DialogFooter>
            </DialogContent>
            

        </Dialog>

    
  )
}

export default CreateLink