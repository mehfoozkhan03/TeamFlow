import React from "react";
import { Form } from "../Components/Form";
import { signup as data } from "../Data/form";

export const Signup = () => (
  <Form props={data} button="Create your account" />
);