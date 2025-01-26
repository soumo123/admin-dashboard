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
import { Link, useNavigate } from 'react-router-dom';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import PaidIcon from '@mui/icons-material/Paid';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import ViewListIcon from '@mui/icons-material/ViewList';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AirplayIcon from '@mui/icons-material/Airplay';
import axios from 'axios'
import { useSelector } from 'react-redux'

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menus from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItems from '@mui/material/MenuItem';
import BadgeIcon from '@mui/icons-material/Badge';
import SummarizeIcon from '@mui/icons-material/Summarize';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
const settings = ['Logout'];

const Sidenav = () => {
    const navigate = useNavigate()
    const { collapseSidebar } = useProSidebar();
    const adminId = localStorage.getItem("adminId")
    const type = localStorage.getItem("type")
    const [count, setCount] = useState("")
    const image = localStorage.getItem("adminImage")
    const dataRefe = useSelector((state) => state.noteRef.arr);
    const access = useSelector((state) => state.systemaccess.access)
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const adminToken = localStorage.getItem("adminToken")

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const countNotification = async () => {

        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${adminToken}` // Bearer Token Format
                }
            };
            const response = await axios.get(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/count_notification?adminId=${adminId}&type=${type}`, config)
            if (response.status === 200) {
                setCount(response.data.data)
            }
        } catch (error) {
            setCount(0)
            console.log(error.stack)
        }
    }

    const handleLogout = async () => {
        localStorage.removeItem("adminId")
        localStorage.removeItem("shop_id")
        localStorage.removeItem("type")
        localStorage.removeItem("adminImage")
        localStorage.removeItem("adminToken")
        sessionStorage.removeItem("adminToken")
        navigate("/")

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
                        <h2>{adminId.includes("ADMIN") ? ("Admin") : ("Employee")}</h2>
                    </MenuItem>

                    {access.dashboard && (<Link to="/" style={{ textDecoration: "none", color: "black" }}><MenuItem icon={<HomeOutlinedIcon />}>Dashboard</MenuItem></Link>)}

                    {access.notification && (<Link to="/notifications" style={{ textDecoration: "none", color: "black" }}>

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
                    </Link>)}
                    {access.addprod && (<Link to="/addVendorProduct" style={{ textDecoration: "none", color: "black" }}><MenuItem icon={<AddCircleIcon />}>Add Products</MenuItem></Link>)}
                    {access.products && (

                        <Link to="/allproducts" style={{ textDecoration: "none", color: "black" }}>

                            <MenuItem icon={<CategoryIcon />}>
                                <SimpleTreeView>
                                    <TreeItem itemId="grid" label=" Products">
                                        <Link to="/addsale" style={{ textDecoration: "none", color: "black" }}>
                                            <TreeItem itemId="grid-community" label="Add Sale" />
                                        </Link>
                                        <Link to="/saleproducts" style={{ textDecoration: "none", color: "black" }}>
                                            <TreeItem itemId="grid-community1" label="Sale Products" />
                                        </Link>
                                    </TreeItem>
                                </SimpleTreeView>
                            </MenuItem>

                        </Link>)}
                    {access.users && (<Link to="/allusers" style={{ textDecoration: "none", color: "black" }}><MenuItem icon={<GroupIcon />}>Users</MenuItem></Link>)}
                    {access.employees && (<Link to="/employee" style={{ textDecoration: "none", color: "black" }}><MenuItem icon={<BadgeIcon />}>Employes</MenuItem></Link>)}

                    {access.tags && (<Link to="/tags" style={{ textDecoration: "none", color: "black" }}><MenuItem icon={<SellIcon />}>Tags</MenuItem></Link>)}
                    {access.orders && (<Link to="/manage-order" style={{ textDecoration: "none", color: "black" }}><MenuItem icon={<StorefrontIcon />}>Manage Order</MenuItem></Link>)}
                    {access.settings && (<Link to="/settings" style={{ textDecoration: "none", color: "black" }}><MenuItem icon={<SettingsIcon />}>Settings</MenuItem></Link>)}
                    {access.vendor && (<Link to="/vendors" style={{ textDecoration: "none", color: "black" }}><MenuItem icon={<AddBusinessIcon />}>Vendors</MenuItem></Link>)}

                    {access.stocks && (<Link to="/stocks" style={{ textDecoration: "none", color: "black" }}><MenuItem icon={<Inventory2Icon />}>Stocks</MenuItem></Link>)}
                    {access.trasnsaction && (<Link to="/transaction" style={{ textDecoration: "none", color: "black" }}><MenuItem icon={<PaidIcon />}>Transaction</MenuItem></Link>)}
                    {access.tax && (<Link to="/tax" style={{ textDecoration: "none", color: "black" }}><MenuItem icon={<AccountBalanceIcon />}>Manage Tax</MenuItem></Link>)}
                    {access.expproducts && (<Link to="/expired" style={{ textDecoration: "none", color: "black" }}><MenuItem icon={<ReportGmailerrorredIcon />}>Expired Products</MenuItem></Link>)}

                    {access.reqorders && (<Link to="/requests" style={{ textDecoration: "none", color: "black" }}><MenuItem icon={<ViewListIcon />}>Request Orders</MenuItem></Link>)}

                    {access.platforms && (<Link to="/platforms" style={{ textDecoration: "none", color: "black" }}><MenuItem icon={<AirplayIcon />}>Platforms</MenuItem></Link>)}
                    {access.report && (<Link to="/reports" style={{ textDecoration: "none", color: "black" }}><MenuItem icon={<SummarizeIcon />}>Reports</MenuItem></Link>)}
                   {access.templates && ( <Link to="/template" style={{ textDecoration: "none", color: "black" }}><MenuItem icon={<AddToPhotosIcon />}>Templates</MenuItem></Link>)}

                </Menu>
                <Box sx={{ flexGrow: 0 }} className="profile-icon">
                    <Tooltip title="Open settings">
                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                            <Avatar alt="Remy Sharp" src={image} />

                        </IconButton>

                    </Tooltip>
                    {`${adminId}`}
                    <Menus
                        sx={{ mt: '45px' }}
                        id="menu-appbar"
                        anchorEl={anchorElUser}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                    >
                        {settings.map((setting) => (
                            <MenuItems key={setting} onClick={handleCloseUserMenu}>
                                <Typography textAlign="center" onClick={handleLogout}>{setting}</Typography>
                            </MenuItems>
                        ))}
                    </Menus>
                </Box>
            </Sidebar>





        </>
    )
}

export default Sidenav
