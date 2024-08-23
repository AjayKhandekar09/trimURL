import Signup from "@/components/Signup";
import supabase, { supabaseUrl } from "./supabase";

export async function login(options) {
    const {email , password} = options
    console.log(email,password);

    const {data, error} = await supabase.auth.signInWithPassword({
        email,
        password,
      });
    
    
      if (error) throw new Error(error.message);
    
      return data;
}

export async function getCurrentUser() {
    const {data:session , error} = await supabase.auth.getSession()
    if(!session.session) return null
    if(error) throw new Error(error.message) 
    return session.session?.user
}

export async function signUp({name , email , password , profile_pic}) {

    console.log(name,email,password);
    
    const filename = `dp${name.split(" ").join('-')}-${Math.random()}`
    const {error : storageError} = await supabase
    .storage
    .from("profile_pic")
    .upload(filename , profile_pic)
    
    if(storageError) throw new Error(storageError.message)
        

    const {data , error} = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            profile_pic: `${supabaseUrl}/storage/v1/object/public/profile_pic/${filename}`,
          },
        },
      });
    if(error){
        console.log("Signup error",error.message);
        
        throw new Error(error.message)
    }
        return data
}

export async function logout() {
  const {error} = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}