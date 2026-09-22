import React from 'react'
import { Form } from '../Components/Form'

import { login as data } from '../Data/form'

export const Login = () => {
<<<<<<< HEAD
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
=======
 
>>>>>>> 82dc45944e56991a53ce7b4a489654cb46239dbb
  return (
    <Form props={data} button="login"/>
  )
}
