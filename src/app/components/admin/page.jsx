"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Drawerr from './adminUI/Drawer'

const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch (error) {
    return true;
  }
};

const Dashboard = () => {
  const router = useRouter();

  useEffect(() => {
    const fetchAdminData = async () => {
      const token = localStorage.getItem('adminToken');
      const adminData = localStorage.getItem('admin');

      if (!token || !adminData || isTokenExpired(token)) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('admin');
        router.push("/components/admin/login");
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/data`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 401) {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('admin');
          router.push("/components/admin/login");
          return;
        }
      } catch (error) {
        console.error("Error:", error);
        if (error.message.includes('unauthorized') || error.message.includes('token')) {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('admin');
          router.push("/components/admin/login");
          return;
        }
      }
    };

    fetchAdminData();
  }, [router]);

  return (
    <div>
     <Drawerr>
     <h2>Admin Dashboard</h2>
     </Drawerr>
    </div>
  );
};

export default Dashboard;
