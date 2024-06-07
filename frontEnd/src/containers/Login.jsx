import React from 'react'

import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode';

import { client } from '../client'
// import { createClient } from "@sanity/client";

import LoginVideo from "../assets/LoginVideo.mp4";
import Logo from "../assets/Logo.png"


const Login = () => {

  // setting up navigation
  const navigate = useNavigate()
  return (
    <div className="flex justify-start items-center flex-col h-screen">
      {/* background video */}
      <div className='relative w-full h-full'>
        <video
          src={LoginVideo}
          loop
          type="video/mp4"
          controls={false}
          muted
          autoPlay
          className='w-full h-full object-cover'
        />
      </div>

      {/* displayed Logo */}
      <div className='absolute flex flex-col justify-center items-center bg-blackOverlay top-0 right-0 left-0 bottom-0'>
        <div className='p-5'>
          <img
            src={Logo}
            width="200px" alt="Pinn Logo"
          />

          <div className="shadow-2x-1">
            {/* Authorizes login and acquires user credentials and decodes them */}

            <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_O_AUTH_TOKEN} >
              <GoogleLogin
                onSuccess={credentialResponse => {
                  // get crediential from google anddecode
                  const cred = jwtDecode(credentialResponse.credential);
                  localStorage.setItem('user', JSON.stringify(cred));

                  const { name, sub, picture } = cred;
                  // console.log(JSON.stringify(cred));

                  // creates a sanity doc of the user
                  const doc = {
                    _id: sub,
                    _type: 'user',
                    userName: name,
                    image: picture,
                  }


                  // console.log(process.env.REACT_APP_SANITY_PROJECT_ID)


                    client.createIfNotExists(doc)
                    .then(() =>{
                      navigate("/", {replace: true})

                    }
                  )
                }


                }
                onError={() => {
                  console.log('Login Failed');
                }
                }
              />
            </GoogleOAuthProvider>
          </div>


        </div>
      </div>
    </div>
  )
}

export default Login
