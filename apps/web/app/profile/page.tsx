import { getProfile } from '@/lib/actions';
import React from 'react'

const ProfilePage = async () => {
  const res = await getProfile(); // call the getProfile() function from actions.ts
  return (
    <div className='text-[1vw]'>
      HELLO
      
      <p>{JSON.stringify(res)}</p>
    </div>
  );
}

export default ProfilePage
