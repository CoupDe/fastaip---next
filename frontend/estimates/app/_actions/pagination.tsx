'use server'
 
import { redirect } from 'next/navigation'
import { revalidateTag } from 'next/cache'
 
export default async function submit() {
  const id = await addPost()
  revalidateTag('posts') // Update cached posts
  redirect(`/post/${id}`) // Navigate to new route
}