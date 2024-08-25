import React, { useState, useEffect } from 'react'
import { Sidebar, Menu, MenuItem, useProSidebar } from "react-pro-sidebar";
//icons from react icons
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import CategoryIcon from '@mui/icons-material/Category';
import GroupIcon from '@mui/icons-material/Group';
import SellIcon from '@mui/icons-material/Sell';
import SettingsIcon from '@mui/icons-material/Settings';
import StorefrontIcon from '@mui/icons-material/Storefront';
//sidebar css from react-pro-sidebar module
import { Link, useFetcher } from 'react-router-dom';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import PaidIcon from '@mui/icons-material/Paid';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import ViewListIcon from '@mui/icons-material/ViewList';
import axios from 'axios'
import { useSelector } from 'react-redux'

const Sidenav = () => {
    const { collapseSidebar } = useProSidebar();
    const adminId = localStorage.getItem("adminId")
    const type = localStorage.getItem("type")
    const [count, setCount] = useState("")
    const dataRefe = useSelector((state) => state.noteRef.arr);

    const countNotification = async () => {

        try {

            const response = await axios.get(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/count_notification?adminId=${adminId}&type=${type}`)
            if (response.status === 200) {
                setCount(response.data.data)
            }
        } catch (error) {
            setCount(0)
            console.log(error.stack)
        }
    }

    useEffect(() => {
        countNotification()
    }, [dataRefe])
    


    return (
        <>

            <Sidebar style={{ height: "100vh" }} className='responsive-div'>
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

                    <Link to="/notifications" style={{ textDecoration: "none", color: "black" }}>

                        <MenuItem icon={<NotificationsIcon />}>
                            <div className="d-flex">
                                Notification
                                {
                                    count > 0 && (
                                        <div class="noti">
                                        <span>{count}</span>
                                    </div>
                                    )
                                }
                               
                            </div>

                        </MenuItem>
                    </Link>
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
                    <Link to="/expired" style={{ textDecoration: "none", color: "black" }}><MenuItem icon={<ReportGmailerrorredIcon />}>Expired Products</MenuItem></Link>

                    <Link to="/requests" style={{ textDecoration: "none", color: "black" }}><MenuItem icon={<ViewListIcon />}>Request Orders</MenuItem></Link>


                </Menu>

            </Sidebar>





        </>
    )
}

export default Sidenav