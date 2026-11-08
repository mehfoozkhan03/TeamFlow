
import { useEffect, useState } from "react";
import { userAuthServices } from "../Services/UserServices";

export const Profile = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    dob: "",
    gender: "",
    phone: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Fetch profile from MongoDB
  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await userAuthServices.allUsers();

      setUser({
        name: response.user.name || "",
        email: response.user.email || "",
        dob: response.user.dob || "",
        gender: response.user.gender || "",
        phone: response.user.phone || "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load profile"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  // Update profile
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSaving(true);
      setMessage("");
      setError("");

      const response = await userAuthServices.updateProfile({
        name: user.name,
        dob: user.dob,
        gender: user.gender,
        phone: user.phone,
      });

      setUser((prevUser) => ({
        ...prevUser,
        ...response.user,
      }));

      setIsEditing(false);
      setMessage("Profile updated successfully!");
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to update profile"
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-3xl">

        {/* Profile Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            My Profile
          </h1>

          <p className="mt-2 text-gray-500">
            View and manage your personal information.
          </p>
        </div>

        {/* Profile Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

          {/* Avatar */}
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-purple-100 text-3xl font-bold text-purple-700">
              {user.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {user.name}
              </h2>

              <p className="text-sm text-gray-500">
                {user.email}
              </p>
            </div>
          </div>

          {/* Messages */}
          {message && (
            <div className="mb-5 rounded-lg bg-green-50 p-3 text-sm text-green-700">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-5 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Profile Form */}
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

              {/* Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={user.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-purple-500 disabled:bg-gray-100"
                />
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  value={user.email}
                  disabled
                  className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-3 text-gray-500 outline-none"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Phone Number
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={user.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-purple-500 disabled:bg-gray-100"
                />
              </div>

              {/* Date of Birth */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Date of Birth
                </label>

                <input
                  type="date"
                  name="dob"
                  value={user.dob}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-purple-500 disabled:bg-gray-100"
                />
              </div>

              {/* Gender */}
              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Gender
                </label>

                <select
                  name="gender"
                  value={user.gender}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-purple-500 disabled:bg-gray-100"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-8 flex flex-wrap justify-end gap-3">

              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      fetchProfile();
                    }}
                    className="rounded-lg border border-gray-300 px-5 py-3 font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="rounded-lg bg-purple-600 px-6 py-3 font-medium text-white hover:bg-purple-700 disabled:opacity-60"
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setMessage("");
                    setError("");
                    setIsEditing(true);
                  }}
                  className="rounded-lg bg-purple-600 px-6 py-3 font-medium text-white hover:bg-purple-700"
                >
                  Edit Profile
                </button>
              )}

            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
