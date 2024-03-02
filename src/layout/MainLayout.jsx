import React from 'react';
import Navbar from '../components/NavBar/NavBar';

const MainLayout = ({ children, user }) => {
  return (
    <div className="grid grid-cols-12 p-5 min-w-[650px]">
      <div className="col-span-3 sm:col-span-3 md:col-span-3 lg:col-span-2 ">
        <Navbar user={user} />
      </div>
      <div className="col-span-9 sm:col-span-9 md:col-span-9 lg:col-span-10 pl-3">
          <main className="w-full h-full bg-white rounded-lg">
            {children}
          </main>
      </div>
    </div>
  );
};


export default MainLayout;

// To use this Layout
// <MainLayout user={user}>
//   {/* Your page/component content goes here */}
// </MainLayout>
