import React from 'react';
import Navbar from '../components/NavBar/NavBar';

const MainLayout = ({ children, user }) => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="box-border grid grid-cols-12 w-[95vw] min-w-[650px] mx-auto">
        <div className="box-border h-[95vh] col-span-3 sm:col-span-3 md:col-span-3 lg:col-span-2">
          <Navbar user={user} />
        </div>
        <div className="box-border h-[95vh] col-span-9 sm:col-span-9 md:col-span-9 lg:col-span-10 pl-3">
          <main className="box-border w-full h-full bg-white rounded-lg">
            {children}
          </main>
        </div>
      </div>
  </div>
  );
};


export default MainLayout;

// To use this Layout
// <MainLayout user={user}>
//   {/* Your page/component content goes here */}
// </MainLayout>
