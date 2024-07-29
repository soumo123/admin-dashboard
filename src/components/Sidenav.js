import React, { useState, useEffect } from 'react'
import { Sidebar, Menu, MenuItem, useProSidebar } from "react-pro-sidebar";
//icons from react icons
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CategoryIcon from '@mui/icons-material/Category';
import GroupIcon from '@mui/icons-material/Group';
import SellIcon from '@mui/icons-material/Sell';
import SettingsIcon from '@mui/icons-material/Settings';
import StorefrontIcon from '@mui/icons-material/Storefront';
//sidebar css from react-pro-sidebar module
import { Link, useParams } from 'react-router-dom'
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import PaidIcon from '@mui/icons-material/Paid';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

const Sidenav = () => {
    const { collapseSidebar } = useProSidebar();

    return (
        <>

            <Sidebar style={{ height: "100vh" }}>
                <Menu>
                    <MenuItem
                        icon={<MenuOutlinedIcon />}
                        onClick={() => {
                            collapseSidebar();
                        }}
                        style={{ textAlign: "center" }}
                    >
                        {" "}
                        <h2>Admin</h2>
                    </MenuItem>

                    <Link to="/" style={{ textDecoration: "none", color: "black" }}><MenuItem icon={<HomeOutlinedIcon />}>Dashboard</MenuItem></Link>
                    {/* <Link to="/create" style={{ textDecoration: "none", color: "black" }}><MenuItem icon={<AddCircleOutlineIcon />}>Create Product</MenuItem></Link> */}
                    <Link to="/allproducts" style={{ textDecoration: "none", color: "black" }}><MenuItem icon={<CategoryIcon />}>Products</MenuItem></Link>
                    <Link to="/allusers" style={{ textDecoration: "none", color: "black" }}><MenuItem icon={<GroupIcon />}>Users</MenuItem></Link>
                    <Link to="/tags" style={{ textDecoration: "none", color: "black" }}><MenuItem icon={<SellIcon />}>Tags</MenuItem></Link>
                    <Link to="/manage-order" style={{ textDecoration: "none", color: "black" }}><MenuItem icon={<StorefrontIcon />}>Manage Order</MenuItem></Link>
                    <Link to="/settings" style={{ textDecoration: "none", color: "black" }}><MenuItem icon={<SettingsIcon />}>Settings</MenuItem></Link>
                    <Link to="/vendors" style={{ textDecoration: "none", color: "black" }}><MenuItem icon={<AddBusinessIcon />}>Vendors</MenuItem></Link>
                   
                    <Link to="/stocks" style={{ textDecoration: "none", color: "black" }}><MenuItem icon={<Inventory2Icon />}>Stocks</MenuItem></Link>
                    <Link to="/transaction" style={{ textDecoration: "none", color: "black" }}><MenuItem icon={<PaidIcon />}>Transaction</MenuItem></Link>
                    <Link to="/tax" style={{ textDecoration: "none", color: "black" }}><MenuItem icon={<AccountBalanceIcon />}>Manage Tax</MenuItem></Link>
                    


                </Menu>
                
            </Sidebar>
         

           


        </>
    )
}

export default Sidenav