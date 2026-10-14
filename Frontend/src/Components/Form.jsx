
import React from "react";
import { ApiCall } from "../Api/ApiCall";
import "../Style/Form.css";
import { useLocation } from "react-router-dom";

export const Form = ({ props = [], button }) => {
  const location = useLocation();

  const [form, setForm] = React.useState(() => {
    return props.reduce((acc, curr) => {
      acc[curr.name] = "";
      return acc;
    }, {});
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await ApiCall.post(
        `/user/${location.pathname}`,
        form
      );
      console.log("data", data);
    } catch (error) {
      console.error("Form submit failed:", error);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
<h2 className="form-title">
  {location.pathname.toLowerCase().includes("signup")
    ? "NEW REGISTRATION"
    : "LOGIN"}
</h2>
      {props.map((el) => (
        <div key={el.id}>
          {el.type !== "select" ? (
            <>
              <label className="form-label" htmlFor={el.name}>
                {el.name}
              </label>

              <input
                id={el.name}
                className="form-input"
                type={el.type}
                name={el.name}
                placeholder={el.placeholder}
                value={form[el.name] ?? ""}
                onChange={handleChange}
              />
            </>
          ) : (
            <>
              <label className="form-label" htmlFor={el.name}>
                {el.name}
              </label>

              <select
                id={el.name}
                className="form-input"
                name={el.name}
                value={form[el.name] ?? ""}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select Gender
                </option>

                {el.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </>
          )}
        </div>
      ))}

      <button type="submit" className="form-btn">
        {button}
      </button>
    </form>
  );
};