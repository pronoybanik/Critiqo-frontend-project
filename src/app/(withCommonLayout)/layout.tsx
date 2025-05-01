import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/NavBar";
import React from "react";


const CommonLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar></Navbar>
      <main >{children}</main>
      <Footer></Footer>
    </>
  );
};

export default CommonLayout;
