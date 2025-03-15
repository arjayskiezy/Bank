import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './LOGIN/Login';
import LogInHeader from './LOGIN/LogInHeader';
import SignUp from './SIGNUP/SignUp';

import UserPage from './USER-PAGE/UserHome';
import BARS from './USER-PAGE/bars';

import UserHome from './USER-PAGE/UserHome';
import UserTransactions from './USER-PAGE/UserTransactions';
import UserPayments from './USER-PAGE/UserPayments';
import UserChangePassword from './USER-PAGE/UserChangePassword';
import UserShare from './USER-PAGE/UserShare';

import AdminPage from './ADMIN-PAGE/AdminPage';
import AdminHeader from './ADMIN-PAGE/AdminHeader';
import AdminLogIn from './ADMIN-PAGE/AdminLogIn';

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/loginheader/*" element={<LogInHeader />} />
          
          {/* User Bar */}
          <Route path="/user/*" element={<BARS />} />

          {/* User Menus */}
          <Route path="/user" element={<UserPage />} />
          <Route path="/userhome" element={<UserHome />} />
          <Route path="/usertransactions" element={<UserTransactions />} />
          <Route path="/userpayments" element={<UserPayments />} />
          <Route path="/usershare" element={<UserShare />} />
          <Route path="/userchangepassword" element={<UserChangePassword />} />
          
          
          {/* Admin Routes */}
          <Route path="/admin/*" element={<AdminHeader />} />
          <Route path="/adminlogin/*" element={<AdminLogIn />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
