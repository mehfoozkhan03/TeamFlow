import React from "react";

import "../Style/Form.css";
/* 
{
name:"nfg",
email:"nfgf",
password:"nfgfr"
}
*/

export const Form = ({ props, button }) => {
  const [form, setForm] = React.useState(() => {
    return props.reduce((acc, curr) => {
      acc[curr.name] = "";
      return acc;
    }, {});
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name);
    setForm((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  console.log(form);
  return (
    <form className="form">
      {props?.map((el) => (
        <div key={el.id}>
          <label htmlFor={el.name}>{el.name}</label>
          <input
            type={el.type}
            name={el.name}
            placeholder={el.placeholder}
            onChange={(e) => handleChange(e)}
          />
        </div>
      ))}
      <button>{button}</button>
    </form>
  );
};

