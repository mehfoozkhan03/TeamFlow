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
    // console.log("name: ", name, "value: ", value);
    // console.log("e", e);
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
                          value={key}
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
      <button>{button}</button>
    </form>
  );
};
