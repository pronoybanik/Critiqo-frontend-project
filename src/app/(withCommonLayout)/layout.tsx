import React from "react";


const CommonLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <p>Navbar section</p>
      <main >{children}</main>
      <p>Footer section</p>
    </>
  );
};

export default CommonLayout;
