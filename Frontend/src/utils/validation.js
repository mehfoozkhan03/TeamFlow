
export const validateForm = (form, isSignup) => {
  const errors = {};

  // Name validation — required only during signup
  if (isSignup) {
    if (!form.name?.trim()) {
      errors.name = "Name is required";
    }
  }

  // Email validation — required for both login and signup
  if (!form.email?.trim()) {
    errors.email = "Email is required";
  } else if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
  ) {
    errors.email = "Please enter a valid email address";
  }

  // Password validation — required for both login and signup
  if (!form.password) {
    errors.password = "Password is required";
  } else if (form.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }

  // All additional signup fields are required
  if (isSignup) {
    // Phone validation
    if (!form.phone?.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(form.phone.trim())) {
      errors.phone = "Phone number must contain exactly 10 digits";
    }

    // Date of birth validation
    if (!form.dob) {
      errors.dob = "Date of birth is required";
    } else {
      const selectedDate = new Date(form.dob);
      const today = new Date();

      today.setHours(0, 0, 0, 0);

      if (
        Number.isNaN(selectedDate.getTime()) ||
        selectedDate >= today
      ) {
        errors.dob = "Please enter a valid date of birth";
      }
    }

    // Validate any other signup fields dynamically
    Object.keys(form).forEach((field) => {
      if (
        !["name", "email", "password", "phone", "dob"].includes(field) &&
        !String(form[field] ?? "").trim()
      ) {
        errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });
  }

  return errors;
};

// contact Validation



