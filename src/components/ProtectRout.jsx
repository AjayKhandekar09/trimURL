import { UrlState } from '@/contextApi'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {BarLoader} from "react-spinners";


function ProtectRout({children}) {
  const {isAuthenticated , loading} = UrlState()
  const navigate = useNavigate()

  useEffect(() => {

    if(!isAuthenticated && loading == false ) {
      navigate("/auth")
    }
  },[isAuthenticated , loading])
  
  if (loading) return <BarLoader width={"100%"} color="#36d7b7" />;

  if (isAuthenticated) return children; 
}

export default ProtectRout