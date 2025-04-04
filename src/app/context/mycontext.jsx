"use client";
import { createContext, useState, useEffect, useContext } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (savedUser && token) {
      const data = JSON.parse(savedUser);
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser); 
      // Log the full data to see if these fields are there
      console.log("Saved User Data:", data); // اینجا بررسی کنید که داده‌ها چه مقادیری دارند

      setUser({
        ...data, // تمام داده‌ها را گرفته و بررسی کنید که مقادیر موجود در اینجا درسته
        mobile: data.mobile , // جلوگیری از undefined
        city: data.city , 
        street: data.street , 
        age: data.age ,
      });
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);
  const loginUser = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData)); // Save all the fields to localStorage
    localStorage.setItem("token", token);
    setUser(userData); // Set all fields in the context
  };

//   const loginUser = (userData, token) => {
//     localStorage.setItem("user", JSON.stringify(userData));
//     localStorage.setItem("token", token);
//     setUser(userData);
//     setUser({
//       ...userData,
//       mobile: userData.mobile || "",
//       city: userData.city || "",
//       street: userData.street || "",
//       age: userData.age || 0,
//     });
//   };

  const logoutUser = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, loginUser, logoutUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
