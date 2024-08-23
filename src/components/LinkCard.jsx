import React from 'react';
import { Link } from 'react-router-dom';
import { Copy, Delete, Download, LinkIcon, Trash } from 'lucide-react';
import { Button } from './ui/button';
import { deleteUrl } from '@/db/apiUrl';
import { BeatLoader } from 'react-spinners';
import useFetch from '@/hooks/useFetch';
function LinkCard({ url, fetchUrls }) {
  console.log("inside qr");
  console.log(url);

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

  const {loading : deleteLoading , fn : fnDelete , error:deleteError , data} = useFetch(deleteUrl,url.id)
 console.log(url?.qr);
 

  return (
    <div className='flex flex-col md:flex-row justify-between gap-5 border p-4 bg-gray-900 rounded-lg text-white'>
      <img
        src={url?.qr}
        className='h-32 object-contain ring ring-blue-500'
        alt='qr pic' 
      />
      <Link className='flex flex-col flex-1' to={`/link/${url?.id}`}>
        <span className='text-3xl font-extrabold hover:underline cursor-pointer text-left'>{url?.title}</span>
        <span className='text-2xl text-blue-400 font-bold hover:underline cursor-pointer text-left'>
          https://trimUrl.in/{url?.custom_url ? url?.custom_url : url?.short_url}
        </span>
        <span className='flex items-center gap-1 hover:underline cursor-pointer text-left'>
          <LinkIcon className="p-1" />
          {url?.original_url}
        </span>
        <span className='flex items-end font-extralight text-sm flex-1 text-left'>
          {new Date(url?.created_at).toLocaleString()}
        </span>
      </Link>
      <div className='flex gap-2'>
        <Button className='text-white' onClick={(e) => {
            const link = url?.custom_url ? url?.custom_url : url?.short_url
            navigator.clipboard.writeText(`https://trimUrl.in/${link}`)
        }}>
          <Copy />
        </Button>
        <Button className='text-white' onClick = {() => {
            fnDelete()
            .then(() => fetchUrls())
        }} >
          {deleteLoading ? <BeatLoader size={5} color='white'/> : <Trash/>}
        </Button>
        <Button className='text-white' onClick={downloadQr}>
          <Download />
        </Button>
      </div>
    </div>
  );
}

export default LinkCard;
