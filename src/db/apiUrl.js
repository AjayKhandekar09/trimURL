import { UAParser } from "ua-parser-js";
import supabase, { supabaseUrl } from "./supabase";

export async function getUrls(user_id) {
    const {data , error} = await supabase.from("urls").select("*").eq("user_id" , user_id)


    if(error) {
        console.error(error.message);
        
        throw new Error("Unable to load URLs")
    } 
    return data
}
export async function getLongUrls(id) {
    console.log("entered inside the getLongUrl");
    let {data , error} =  await supabase
    .from("urls")
    .select("id, original_url")
    .or(`short_url.eq.${id},custom_url.eq.${id}`)
    .single()

    
    
    if(error) {
        console.error(error.message);
        
        throw new Error("Unable to get long URLs")
    } 
    return data

//     let {data: shortLinkData, error: shortLinkError} = await supabase
//     .from("urls")
//     .select("id, original_url")
//     .or(`short_url.eq.${id},custom_url.eq.${id}`)
//     .single();

//   if (shortLinkError && shortLinkError.code !== "PGRST116") {
//     console.error("Error fetching short link:", shortLinkError);
//     return;
//   }

//   return shortLinkData;
}

export async function deleteUrl(id) {
    const {data , error} = await supabase.from("urls").delete().eq("id" , id)


    if(error) {
        console.error(error.message);
        
        throw new Error("Unable to delete URL")
    } 
    return data
}

export async function createUrls({title ,original_url , custom_url , user_id } , qr) {
    const short_url = Math.random().toString(36).substring(2,6)    
    const filename = `qr${short_url}`
    console.log(qr);
    
    const {error : storageError} = await supabase
    .storage
    .from("qr")
    .upload(filename , qr)
    console.log(typeof qr);
    
    if(storageError) throw new Error(storageError.message)
    const qrCode = `${supabaseUrl}/storage/v1/object/public/qr/${filename}`

    const {data , error} = await supabase.from("urls").insert([
        {
          title,
          user_id,
          original_url: original_url,
          custom_url: custom_url || null,
          short_url,
          qr : qrCode,
        },
      ]
).select()

    if(error) {
        console.error("Error while creating the Url");
        throw new Error(error.message)
        
    }
}

const parser = new UAParser()

export const storeClicks = async ({id , original_url}) => {
    try {
        const result = parser.getResult()

        const device = result.type || 'desktop'
        const res = await fetch("https://ipapi.co/json");
        const {city , country_name: country} = await res.json()
        console.log(res);
        
        await supabase.from("clicks").insert({
            url_id : id,
            city : city,
            country : country,
            device : device
        })

        window.location.href = original_url
        
    } catch (error) {
        console.error("error recording click");
        throw new Error(error.message)
        
    }
}

export const getUrl = async ({id , user_id}) => {
    console.log("etered in getUrl",user_id);
    
    const {data, error} = await supabase
    .from("urls")
    .select("*")
    .eq("id", id)
    .eq("user_id", user_id)
    .single();
    if(error) {
        console.error("Error fetching short Url");
        throw new Error(error.message)
        
    }
    
    
    return data;
}


// export const getClicksForUrls = async ({id , user_id}) => {
//     const {data , error} = await supabase.from("urls")
//     .select("*")
//     .eq("id" , id)
//     .eq("user_id" , user_id)
//     .single()
//     if(error) {
//         console.error("Error fetching short Url");
//         throw new Error(error.message)
        
//     }
// }