import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  FaBriefcase,
  FaBuilding,
  FaCalendarAlt,
  FaEnvelope,
  FaIdCard,
  FaPhone,
  FaUser,
  FaBirthdayCake,
} from "react-icons/fa";

const Frontend = () => {
  const [formData, setFormData] = useState({
    EmployeeID: "",
    Name: "",
    Email: "",
    PhoneNumber: "",
    Department: "",
    DateOfJoining: "",
    Role: "",
    DOB: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [age, setAge] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.EmployeeID || formData.EmployeeID.length > 10) {
      newErrors.EmployeeID = "Employee ID must be <= 10 characters";
    }

    if (!formData.Email.includes("@")) {
      newErrors.Email = "Valid Email is required";
    }

    if (formData.PhoneNumber.length !== 10) {
      newErrors.PhoneNumber = "Phone number must be 10 digits";
    }

    if (!formData.Department) {
      newErrors.Department = "Department is required";
    }

    if (!formData.DateOfJoining || new Date(formData.DateOfJoining) > new Date()) {
      newErrors.DateOfJoining = "Date of Joining cannot be in the future";
    }

    if (!formData.Role) {
      newErrors.Role = "Role is required";
    }

    if (!formData.DOB) {
      newErrors.DOB = "Date of Birth is required";
    } else {
      const birthYear = new Date(formData.DOB).getFullYear();
      if (birthYear >= 2004) {
        newErrors.DOB = "Date of Birth must be earlier than the year 2004";
      }
    }

    return newErrors;
  };

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth();
    if (month < birthDate.getMonth() || (month === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  useEffect(() => {
    if (formData.DOB) {
      setAge(calculateAge(formData.DOB));
    }
  }, [formData.DOB]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      try {
        const res = await axios.post("http://localhost:5000/employees", formData);
        setMessage(res.data.message);
        setErrors({});
        setFormData({
          EmployeeID: "",
          Name: "",
          Email: "",
          PhoneNumber: "",
          Department: "",
          DateOfJoining: "",
          Role: "",
          DOB: "",
        });
        setFormSubmitted(true);
      } catch (err) {
        setMessage(err.response?.data?.message || "Submission failed");
      }
    }
  };

  const handleReset = () => {
    setFormData({
      EmployeeID: "",
      Name: "",
      Email: "",
      PhoneNumber: "",
      Department: "",
      DateOfJoining: "",
      Role: "",
      DOB: "",
    });
    setAge(null);
    setMessage("");
    setErrors({});
    setFormSubmitted(false);
  };

  const inputFields = [
    { id: "EmployeeID", label: "Employee ID", icon: <FaIdCard /> },
    { id: "Name", label: "Name", icon: <FaUser /> },
    { id: "Email", label: "Email", icon: <FaEnvelope /> },
    { id: "PhoneNumber", label: "Phone Number", icon: <FaPhone /> },
    {
      id: "Department",
      label: "Department",
      icon: <FaBuilding />,
      type: "select",
      options: ["HR", "Engineering", "Marketing", "Finance"],
    },
    {
      id: "DateOfJoining",
      label: "Date of Joining",
      icon: <FaCalendarAlt />,
      type: "date",
    },
    {
      id: "Role",
      label: "Role",
      icon: <FaBriefcase />,
      type: "select",
      options: ["Manager", "Developer"],
    },
    {
      id: "DOB",
      label: "Date of Birth",
      icon: <FaBirthdayCake />,
      type: "date",
    },
  ];

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-sm bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Add Employee</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {inputFields.map(({ id, label, type = "text", icon, options }) => (
            <div key={id} className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-gray-500">{icon}</span>
              </div>
              {type === "select" ? (
                <select
                  id={id}
                  value={formData[id]}
                  onChange={(e) => setFormData({ ...formData, [id]: e.target.value })}
                  className={`w-full px-10 py-2 text-gray-900 border rounded-md focus:ring-2 ${
                    errors[id] ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-gray-400"
                  }`}
                >
                  <option value="" disabled>Select {label}</option>
                  {options?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={id}
                  type={type}
                  placeholder=" "
                  value={formData[id]}
                  onChange={(e) => setFormData({ ...formData, [id]: e.target.value })}
                  className={`w-full px-10 py-2 text-gray-900 border rounded-md focus:ring-2 ${
                    errors[id] ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-gray-400"
                  }`}
                />
              )}
              <label
                htmlFor={id}
                className="absolute text-gray-500 text-sm transform -translate-y-6 scale-90 top-2 left-10 bg-white px-1"
              >
                {label}
              </label>
              {errors[id] && (
                <p className="mt-1 text-xs text-red-500">{errors[id]}</p>
              )}
            </div>
          ))}

          {!formSubmitted && (
            <div className="relative">
              <label
                htmlFor="Age"
                className="absolute text-gray-500 text-sm transform -translate-y-6 scale-90 top-2 left-10 bg-white px-1"
              >
                Age
              </label>
              <input
                id="Age"
                type="text"
                value={age !== null ? age : ""}
                readOnly
                className="w-full px-10 py-2 text-gray-900 border rounded-md focus:ring-2 border-gray-300 focus:ring-gray-400"
              />
            </div>
          )}

          <div className="flex justify-between">
            <button
              type="submit"
              className="w-full bg-gray-800 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="w-full bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Reset
            </button>
          </div>
        </form>

        {message && (
          <div
            className={`mt-6 p-4 text-center text-sm rounded-lg ${
              message.includes("failed")
                ? "bg-red-100 text-red-600 border border-red-300"
                : "bg-green-100 text-green-600 border border-green-300"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default Frontend;
