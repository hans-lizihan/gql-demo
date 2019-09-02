import React from "react";
import { useAuth0 } from "../react-auth0-wrapper";
import { Menu } from 'antd';

// NEW - import the Link component
import { Link } from "react-router-dom";

const NavBar = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();


  return (
    <Menu
      theme="dark"
      mode="horizontal"
      style={{ lineHeight: '64px' }}
      onClick={({ key }) => {
        if (key === '3') {
          loginWithRedirect();
        }
        if (key === '4') {
          logout();
        }
      }}
    >
      <Menu.Item key="1"><Link to="/" /> Home</Menu.Item>
      {!isAuthenticated && <Menu.Item key="3" style={{float: 'right' }}>Login</Menu.Item>}
      <Menu.SubMenu style={{float: 'right'}} key="profile" title="Profile">
        <Menu.Item key="2"><Link to="/profile" /> Profile</Menu.Item>
        {isAuthenticated && <Menu.Item key="4">Logout</Menu.Item>}
      </Menu.SubMenu>
    </Menu>
  );
};

export default NavBar;
