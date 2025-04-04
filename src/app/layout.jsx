"use client"

import PrimarySearchAppBar from './components/header';
import { UserProvider } from "./context/mycontext";
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
       
      <UserProvider>
      {children}
    </UserProvider>
      </body>
    </html>
  );
}