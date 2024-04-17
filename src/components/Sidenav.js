import React, { useState, useEffect, useLayoutEffect } from 'react'
import {
    ProSidebar,
    Menu,
    MenuItem,
    SidebarHeader,
    SidebarFooter,
    SidebarContent,
} from "react-pro-sidebar";
//icons from react icons
import { FaList, FaRegHeart } from "react-icons/fa";
import { FiHome, FiLogOut, FiArrowLeftCircle, FiArrowRightCircle } from "react-icons/fi";
import { RiPencilLine } from "react-icons/ri";
import { BiCog } from "react-icons/bi";
import { SiApacheairflow } from "react-icons/si";
import { GiAbstract050 } from "react-icons/gi";
//sidebar css from react-pro-sidebar module
import "react-pro-sidebar/dist/css/styles.css";
import { Link, useParams } from 'react-router-dom'



const Sidenav = () => {
    const { adminId, id, type } = useParams();
    console.log("adminId,id,type ---Navbar", adminId, id, type)
    //menuCollapse state using useState hook
    const [menuCollapse, setMenuCollapse] = useState(false)
    //custom function that will change menucollapse state from false to true and true to false
    const menuIconClick = () => {
        //condition checking to change state from true to false and vice versa
        menuCollapse ? setMenuCollapse(false) : setMenuCollapse(true);
    };

    useEffect(() => {
        if(adminId && id && type){

            localStorage.setItem("adminId", window.atob(adminId))
            localStorage.setItem("shop_id", window.atob(id))
            localStorage.setItem("type", window.atob(type))
        }

    }, [adminId,
        id,
        type])



    return (
        <>
            <div id="header">
                {/* collapsed props to change menu size using menucollapse state */}
                <ProSidebar collapsed={menuCollapse}>
                    <SidebarHeader>
                        <div className="logotext">
                            {/* Icon change using menucollapse state */}
                            <p>{menuCollapse ? <GiAbstract050 /> : <SiApacheairflow />}</p>
                        </div>
                        <div className="closemenu" onClick={menuIconClick}>
                            {/* changing menu collapse icon on click */}
                            {menuCollapse ? (
                                <FiArrowRightCircle />
                            ) : (
                                <FiArrowLeftCircle />
                            )}
                        </div>
                    </SidebarHeader>
                    <SidebarContent>
                        <Menu iconShape="square">
                            <MenuItem active={true} icon={<FiHome />}>
                                <Link to={`/`}> Dashboard</Link>
                            </MenuItem>
                            <MenuItem icon={<FaList />}><Link to={`/create`}>Product Create</Link></MenuItem>
                            <MenuItem icon={<FaRegHeart />}><Link to={`/allproducts`}>Products</Link></MenuItem>
                            <MenuItem icon={<RiPencilLine />}><Link to={`/allusers`}>Users</Link></MenuItem>
                            <MenuItem icon={<BiCog />}><Link to={`/tags`}>Tags</Link></MenuItem>
                            <MenuItem icon={<BiCog />}><Link to={`/settings`}>Settings</Link></MenuItem>

                        </Menu>
                    </SidebarContent>
                    <SidebarFooter>
                        <Menu iconShape="square">
                            <MenuItem icon={<FiLogOut />}>Logout</MenuItem>
                        </Menu>
                    </SidebarFooter>
                </ProSidebar>
            </div>

        </>
    )
}

export default Sidenav