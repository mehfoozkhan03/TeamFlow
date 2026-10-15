import React from "react";
import { Form } from "../Components/Form";
import { login as data } from "../Data/form";

export const Login = () => (
  <Form props={data} button="Sign in to TeamFlow" />
);