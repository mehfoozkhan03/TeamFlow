
export const validateForm = (form, isSignup) => {
  const errors = {};

  // ========== NAME VALIDATION ==========
  // Name is required only during signup

  if (isSignup) {
    if (!form.name?.trim()) {
      errors.name = "Name is required";
    }
  }

  // ========== EMAIL VALIDATION ==========
  // Email is required for both login and signup
  // Only @teamflow.org email addresses are allowed

  if (!form.email?.trim()) {
    errors.email = "Email is required";
  } else {
    const email = form.email.trim();

    const emailRegex = /^[^\s@]+@teamflow\.org$/i;

    if (!emailRegex.test(email)) {
      errors.email = "Email must use the @teamflow.org domain";
    }
  }

  // ========== PASSWORD VALIDATION ==========
  // Password is required for both login and signup
  // Minimum password length is 8 characters

  if (!form.password) {
    errors.password = "Password is required";
  } else if (form.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }

  // ========== SIGNUP VALIDATIONS ==========

  if (isSignup) {
    // ========== PHONE NUMBER VALIDATION ==========
    // Phone number must contain exactly 10 digits
    // All 10 digits cannot be identical

    if (!form.phone?.trim()) {
      errors.phone = "Phone number is required";
    } else {
      const phone = form.phone.trim();

      if (!/^\d{10}$/.test(phone)) {
        errors.phone =
          "Phone number must contain exactly 10 digits";
      } else if (/^(\d)\1{9}$/.test(phone)) {
        errors.phone =
          "Phone number cannot contain the same digit repeatedly";
      }
    }

    // ========== DATE OF BIRTH VALIDATION ==========
    // User must be at least 20 years old

    if (!form.dob) {
      errors.dob = "Date of birth is required";
    } else {
      const selectedDate = new Date(`${form.dob}T00:00:00`);
      const today = new Date();

      // Reset today's time to midnight
      today.setHours(0, 0, 0, 0);

      if (Number.isNaN(selectedDate.getTime())) {
        errors.dob = "Please enter a valid date of birth";
      } else if (selectedDate > today) {
        errors.dob = "Date of birth cannot be in the future";
      } else {
        // Calculate the date the user turns 20
        const minimumDate = new Date(
          today.getFullYear() - 20,
          today.getMonth(),
          today.getDate()
        );

        if (selectedDate > minimumDate) {
          errors.dob =
            "You must be at least 20 years old to register";
        }
      }
    }

    // ========== OTHER SIGNUP FIELDS ==========
    // Any additional signup field is required by default

    Object.keys(form).forEach((field) => {
      if (
        !["name", "email", "password", "phone", "dob"].includes(field) &&
        !String(form[field] ?? "").trim()
      ) {
        errors[field] =
          `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });
  }

  // Return all validation errors
  return errors;
};

// contact Validation



