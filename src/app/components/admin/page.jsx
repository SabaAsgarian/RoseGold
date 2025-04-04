"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Drawerr from './adminUI/Drawer'
const Dashboard = () => {
  // const [data, setData] = useState(null);
  // const [error, setError] = useState("");
  // const router = useRouter();

  // useEffect(() => {
  //   const fetchDashboardData = async () => {
  //     try {
  //       const token = localStorage.getItem("token");
  //       if (!token) {
  //         router.push("components/admin/login");
  //         return;
  //       }

  //       const res = await axios.get("http://localhost:5000/api/admin", {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });

  //       setData(res.data);
  //     } catch (err) {
  //       setError("Access Denied or Error Fetching Data");
  //     }
  //   };

  //   fetchDashboardData();
  // }, [router]);

  return (
    <div>
     <Drawerr>
     <h2>Admin Dashboard</h2>
      {/* {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <p>{data ? data.message : "Loading..."}</p>
      )} */}
     </Drawerr>
    </div>
  );
};

export default Dashboard;
