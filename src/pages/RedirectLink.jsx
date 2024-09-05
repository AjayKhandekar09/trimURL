import { getLongUrls, storeClicks } from '@/db/apiUrl'
import useFetch from '@/hooks/useFetch'
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { BarLoader } from 'react-spinners'

function RedirectLink() {

  const {id} = useParams()

  const {loading , data , fn} = useFetch(getLongUrls , id)

  const {loading : loadingClicks , data: statsData , fn: fnStoreClicks } = useFetch(storeClicks , {
    id : data?.id,
    original_url : data?.original_url
  })
  
  useEffect(() => {
    fn()
},[])

    useEffect(() => {
      if(loading && data) {
        fnStoreClicks()
        console.log(data?.original_url);
        
        window.location.href = data?.original_url
      }
    },[loading])

    if(loading || loadingClicks) {
      return (<>
      <BarLoader width={"100%"} color='black' />
      <br/>
      Redirecting....
      </>)
    }
  return null
}

export default RedirectLink