import React, { useEffect, useState } from 'react'
import { BarLoader } from 'react-spinners'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import { Filter } from 'lucide-react'
import { Input } from '@/components/ui/input'
import useFetch from '@/hooks/useFetch'
import { getClicksForUrls} from '@/db/apiClicks'
import { getUrls } from '@/db/apiUrl'
import { UrlState } from '@/contextApi'
import LinkCard from '@/components/LinkCard'
import CreateLink from '@/components/CreateLink'

const Dashboard = () => {
  const [searchQuery , setSearchQuery] = useState("")
   const {user }=UrlState()
  const {data: urls , loading , fn: fnUrls , error} = useFetch(getUrls , user?.id)

  const {data: clicks , loading : clicksLoading , fn: fnClicks , error:clicksError}  =  useFetch(getClicksForUrls , urls?.map((urls) => urls.id))

  useEffect(() => {
    fnUrls()
  } , [])

  useEffect(() => {
    if(urls?.length) fnClicks()
  } , [urls?.length])

  const filteredUrls = urls?.filter((url) =>
    url.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return( 
    <div className='flex flex-col gap-8'>
      {(loading || clicksLoading )&& <BarLoader width={"100%"} color='black' />}
      <div className='grid grid-cols-2 gap-4'>
        <Card>
          <CardHeader>
            <CardTitle>Links Created</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{urls?.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Click</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{clicks?.length}</p>
          </CardContent>
        </Card>

      </div>
      <div className='flex justify-between'>
        <h1 className='text-4xl font-extrabold'>My Links</h1>
          <CreateLink/>
      </div>
      <div className='relative'>
        <Input type='text' 
        placeholder="Search your Links..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Filter className='absolute right-2 top-2 p-1' />
      </div>
      {error && <Error message={error.message}/>}
      {(filteredUrls || []).map((url,i) => {
        console.log("inside the filter");
        console.log(url?.title);
        
        return <LinkCard key = {i}  url={url} fetchUrls = {fnUrls} />
      } )}
    </div>)
    
  
}

export default Dashboard