import React, { useState } from 'react'

const useFetch = (cb , options = {}) => {
    const [loading , setLoading]=useState(null)
    const [data , setData]=useState(null)
    const [error , setError] = useState(null)
    const fn = async (...args) => {
        setLoading(true)
        setError(null)
        try {
            if(cb?.name === 'storeClicks' || cb?.name === 'getLongUrls')
            console.log("Callback function name:", cb?.name || "Anonymous function");
            const response = await cb(options, ...args)
            console.log(response);
            
            setData(response)
            setError(null)
        } catch (error) {
            console.log("setting error");
            
            setError(error)
        } finally {
            setLoading(false)
        }
    }

  return {data ,loading , error , fn}
}

export default useFetch