import DeviceStats from '@/components/DeviceStats'
import LocationStats from '@/components/LocationStats'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UrlState } from '@/contextApi'
import { getClicksForUrl } from '@/db/apiClicks'
import { deleteUrl, getUrl } from '@/db/apiUrl'
import useFetch from '@/hooks/useFetch'
import { Copy, Download, LinkIcon, Trash } from 'lucide-react'
import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BarLoader, BeatLoader } from 'react-spinners'
import { ResponsiveContainer } from 'recharts'

function Link() {
  const downloadQr = () => {
    const imageUrl = url?.qr
    const fileName =  url?.title ? `${url?.title}.png` : 'qr-code.png'; 
    const link = document.createElement('a')
    link.href = imageUrl
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const {id} = useParams()
  const {user} = UrlState()
  const navigate = useNavigate()
  const {
    loading,
    data : url,
    error,
    fn
  } = useFetch(getUrl , {id:id ,user_id : user?.id})
  const {
    loading : clicksLoading ,
    data : clicksData,
    error : clicksError,
    fn : fnClicks
  } = useFetch(getClicksForUrl , id)

  const {loading : deleteLoading , fn: fnDelete} = useFetch(deleteUrl , id)

  useEffect(() => {
    fn()
    fnClicks()
  }, [])

  if(error) navigate("/dashboard")

  let link = ""

  if(url) {
    link = url?.custom_url ? url.custom_url : url.short_url;
  }

  return (
    <>
      {(loading || clicksLoading) && (
        <BarLoader className='mb-4' width={"100%"} color='black'/>
      )}
      <div className='flex flex-col gap-8 sm:flex-row justify-between'>
        <div className='flex flex-col gap-8 items-start rounded-lg sm:w-2/5'>
          <span className="text-6xl font-extrabold hover:underline cursor-pointer">{url?.title}</span>
          <a href={`https://trim-url-puce.vercel.app/${link}`} className="flex items-center gap-1 hover:underline cursor-pointer" target='_blank'>
            https://trim-url-puce.vercel.app/{link}
          </a>
          <a href={url?.original_url} className="text-3xl sm:text-4xl text-blue-400 font-bold hover:underline cursor-pointer" target='_blank'>
            <LinkIcon className="p-1"/>
            {url?.original_url}
          </a>
          <span className="flex items-end font-extralight text-sm">{new Date(url?.created_at).toLocaleString()}</span>
          <div className='flex gap-2'>
            <Button className='text-black bg-white' onClick={() => {
              const link = url?.custom_url ? url?.custom_url : url?.short_url
              navigator.clipboard.writeText(`https://trim-url-puce.vercel.app/${link}`)
            }}>
              <Copy />
            </Button>
            <Button className='text-black bg-white' onClick={() => {
              fnDelete()
            }}>
              {deleteLoading ? <BeatLoader size={5} color='white'/> : <Trash/>}
            </Button>
            <Button className='text-black bg-white' onClick={downloadQr}>
              <Download />
            </Button>
          </div>
          <img
            src={url?.qr}
            className="w-full self-center sm:self-start ring ring-blue-500 p-1 object-contain"
            alt="qr code"
          />
        </div>
        <Card className="sm:w-3/5">
          <CardHeader>
            <CardTitle>Link Statistics</CardTitle>
          </CardHeader>
          {clicksData && clicksData?.length ? (
            <CardContent className="flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Total Clicks</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{clicksData?.length}</p>
                </CardContent>
              </Card>
              <CardTitle>Location Details</CardTitle>
              <LocationStats clicksData={clicksData}/>
              <CardTitle>Device Info</CardTitle>
              <DeviceStats clicksData={clicksData}/>
            </CardContent>
          ) : (
            <CardContent>
              {clicksLoading === false ? "No Statistics yet" : "Loading..."}
            </CardContent>
          )}
        </Card>
      </div>
    </>
  )
}

export default Link
