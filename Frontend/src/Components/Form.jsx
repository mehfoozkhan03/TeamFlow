import React from "react";

import { ApiCall } from "../Api/ApiCall";
import "../Style/Form.css";
import { useLocation } from "react-router-dom";

/* 
{
name:"nfg",
email:"nfgf",
password:"nfgfr"
}
*/

export const Form = ({ props, button }) => {

  const location= useLocation();


  console.log(location)

  const [form, setForm] = React.useState(() => {
    return props.reduce((acc, curr) => {
      acc[curr.name] = "";
      return acc;
    }, {});
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await ApiCall.post(`/user/${location.pathname}`, form);
    console.log("data", data);
  };

  console.log(form);
  return (
    <form className="form" onSubmit={(e) => handleSubmit(e)}>
      {props?.map((el) => (
        <div key={el.id}>
          {el.name != "gender" ? (
            <>
              <label htmlFor={el.name}>{el.name}</label>
              <input
                type={el.type}
                name={el.name}
                placeholder={el.placeholder}
                onChange={(e) => handleChange(e)}
              />
            </>
          ) : (
            <>
              <label>{el.name}</label>
              <div className="gender">
                <div
                  className="child_gender"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "10px",
                  }}
                >
                  {Object.entries(el.typeOfGender).map(([key, value]) => {
                    return (
                      <div key={key}>
                        <label htmlFor={el.name}>{key}</label>
                        <input
                          name={el.name}
                          type={value.type}
                          value={key.replace(/\b\w/g, char => char.toUpperCase())}
                          onChange={(e) => handleChange(e)}
                        />
                      </div>
                    );
                  })}

                  {/* <label htmlFor="">{el.typeOfGender.male.name}</label>
                  <input name={el.name} type={el.typeOfGender.male.type} />
                  <label htmlFor="">{el.typeOfGender.female.name}</label>
                  <input name={el.name} type={el.typeOfGender.female.type} /> */}
                </div>
              </div>
            </>
          )}
        </div>
      ))}
      <button type="submit">{button}</button>
    </form>
  );
};

