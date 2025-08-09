import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import SideNav from './SideNav';

const Layout = () => {
    return (
        <div>
            <Header />
            <div className="flex">
                <SideNav />
                <div className="flex-1">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Layout;