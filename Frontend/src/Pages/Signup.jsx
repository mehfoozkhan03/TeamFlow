import React from 'react'
import { Form } from '../Components/Form'

export const Signup = () => {
   const data=[
    {
      id:1,
      name:"name",
      type:"text",
      placeholder:"enter you'r name..."
    },
    {
      id:2,
      name:"email",
      type:"email",
      placeholder:"enter you'r email..."
    },
    {
      id:3,
      name:"password",
      type:"password",
      placeholder:"enter you'r password..."
    }
  ]
  return (
   <Form props={data} button="signup"/>
  )
}
