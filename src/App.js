
import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import CreateProduct from './components/CreateProduct';
import Sidenav from './components/Sidenav';
import { Routes, Route, Navigate } from "react-router-dom";
import AllProduct from './components/AllProduct';
import AllUsers from './components/AllUsers';
import Tags from './components/Tags';
import { useParams } from 'react-router-dom'
import Settings from './components/Settings';
import { useLocation } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import EditProduct from './components/EditProduct';
import ViewProduct from './components/ViewProduct';
import Orders from './components/Orders';
import Vendor from './components/Vendor';
import AddVendorProducts from './custom/AddVendorProducts';
import UpdateStock from './components/UpdateStock';
import Transaction from './components/Transaction';
import Taxes from './components/Taxes';
import Notifications from './components/Notifications';
import Expiredproducts from './components/Expiredproducts';
import Requestedorders from './components/Requestedorders';
import Authentication from './components/Authentication';
import ReqManualOrder from './components/ReqManualOrder';
import { jwtDecode } from "jwt-decode";
import Employe from './components/Employe';
import Platforms from './components/Platforms';
import AddEmployee from './components/AddEmployee';
import Editemployee from './components/Editemployee';
import axios from 'axios';
import {
  getAccessSuccess,
  getAccessFail
} from './redux/actions/userAction'
import { useSelector,useDispatch } from 'react-redux';
import Transactionreport from './components/Transactionreport';
import BottomBar from './components/BottomBar';
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const location = useLocation();
  const dispatch = useDispatch()
  const queryParams = new URLSearchParams(location.search); // Parse query parameters
  const type = queryParams.get('type');
  const adminId = queryParams.get('adminId');
  const shop_id = queryParams.get('shop_id');
  const adminToken = localStorage.getItem("adminToken")

  const access = useSelector((state)=>state.systemaccess.access)



  useEffect(() => {
    if (adminId && shop_id && type) {

      localStorage.setItem("adminId", window.atob(adminId))
      localStorage.setItem("shop_id", window.atob(shop_id))
      localStorage.setItem("type", window.atob(type))
    }

  }, [adminId,
    shop_id,
    type])

  const exactadminId = localStorage.getItem("adminId")
  const exactShopId = localStorage.getItem("shop_id")
  const exactType = localStorage.getItem("type")


  setInterval(() => {

    if (adminToken) {
      const decodedToken = jwtDecode(adminToken);
      const currentTime = Math.floor(Date.now() / 1000);
      if (currentTime > decodedToken.exp) {
        localStorage.removeItem("adminId")
        localStorage.removeItem("adminImage")
        localStorage.removeItem("adminToken")
        localStorage.removeItem("shop_id")
        localStorage.removeItem("type")
        window.location.reload()
      }

    }

  }, 10000);


  const handleAccess = async () => {
    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${adminToken}` // Bearer Token Format
        }
      };
      const response = await axios.get(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/access?shop_id=${exactShopId}&adminId=${exactadminId}`, config);
      if (response.status === 200) {
        dispatch(getAccessSuccess(response.data.data))
      }

    } catch (error) {
      dispatch(getAccessFail(error.response.data.message))
      console.log(error)
    }
  }

  useEffect(() => {
    if(exactadminId && exactShopId){

      handleAccess()
    }
  }, [exactadminId,exactShopId])

  console.log("access111", access)

  return (
    <>


      <div id="app" style={({ height: "100vh" })}>
        <div className="admin-box">
          <div className="admin-sidebar">
            {
              exactadminId === "" || exactadminId === null || exactShopId === "" || exactShopId === null || exactType === "" || exactType === null ? (
                ""
              ) : (
                <Sidenav />
              )
            }

          </div>


          <div className="admin-content">
         
                {
                  exactadminId === "" || exactadminId === null || exactShopId === "" || exactShopId === null || exactType === "" || exactType === null ? (
                    <Routes>
                      <Route exact={true} path="/" element={<Authentication />} />
                      <Route path="*" element={<Navigate to="/" />} /> {/* Redirect to / */}
                    </Routes>
                  ) : (
                    <Routes>
                     {access.dashboard ? (<Route exact={true} path={`/`} element={<Dashboard />} />) : (<Route exact={true} path="/" element={<Orders />} />)} 
                    {access.products ? (<Route exact={true} path="/allproducts" element={<AllProduct />} />) : ( <Route exact={true} path="/" element={<Orders />} />)}  
                    {access.products ? (<Route exact={true} path="/updateproduct/:id" element={<EditProduct />} />) : (<Route exact={true} path="/" element={<Orders />} />)}  
                    {access.products ?  ( <Route exact={true} path="/vewProduct/:id" element={<ViewProduct />} />) : (<Route exact={true} path="/" element={<Orders />} />)} 
                    {access.users ? ( <Route exact={true} path="/allusers" element={<AllUsers />} />) : (<Route exact={true} path="/" element={<Orders />} />)} 
                    {access.tags ? ( <Route exact={true} path="/tags" element={<Tags />} />) : (<Route exact={true} path="/" element={<Orders />} />)} 
                    {access.settings ? (<Route exact={true} path="/settings" element={<Settings />} />): (<Route exact={true} path="/" element={<Orders />} />)}  
                    {access.orders ? ( <Route exact={true} path="/manage-order" element={<Orders />} />) : (<Route exact={true} path="/" element={<Orders />} />)} 
                    {access.vendor ? ( <Route exact={true} path="/vendors" element={<Vendor />} />) : (<Route exact={true} path="/" element={<Orders />} />)} 

                    {access.addprod ? (<Route exact={true} path="/addVendorProduct" element={<AddVendorProducts />} />): (<Route exact={true} path="/" element={<Orders />} />)}
                    {access.stocks ? (<Route exact={true} path="/stocks" element={<UpdateStock />} />) : (<Route exact={true} path="/" element={<Orders />} />)}  
                    {access.trasnsaction ? ( <Route exact={true} path="/transaction" element={<Transaction />} />) : (<Route exact={true} path="/" element={<Orders />} />)} 
                    {access.tax ? (<Route exact={true} path="/tax" element={<Taxes />} />) : (<Route exact={true} path="/" element={<Orders />} />)}  

                    {access.notification ? (<Route exact={true} path="/notifications" element={<Notifications />} />) : (<Route exact={true} path="/" element={<Orders />} />)}  
                    {access.expproducts ? (<Route exact={true} path="/expired" element={<Expiredproducts />} />) : (<Route exact={true} path="/" element={<Orders />} />)}  
                    {access.reqorders ? (<Route exact={true} path="/requests" element={<Requestedorders />} />) : (<Route exact={true} path="/" element={<Orders />} />)} 

                    {access.orders ? (<Route exact={true} path="/manualorders" element={<ReqManualOrder />} />) : (<Route exact={true} path="/" element={<Orders />} />)}  

                    {access.employees ? (<Route exact={true} path="/employee" element={<Employe />} />) : (<Route exact={true} path="/" element={<Orders />} />)}  
                    {access.employees ? ( <Route exact={true} path="/addemp" element={<AddEmployee />} />) : (<Route exact={true} path="/" element={<Orders />} />)} 
                    {access.employees ? (<Route exact={true} path="/editemp/:id" element={<Editemployee />} />) : (<Route exact={true} path="/" element={<Orders />} />)}  

                    {access.platforms ? (<Route exact={true} path="/platforms" element={<Platforms />} />):(<Route exact={true} path="/" element={<Orders />} />)} 

                    {access.report ? (<Route exact={true} path="/reports" element={<Transactionreport />} />):(<Route exact={true} path="/" element={<Orders />} />)} 

                    </Routes>
                  )
                }






             
          </div>
        </div >





      </div >
      <div className="admin-bottom">
            {
              exactadminId === "" || exactadminId === null || exactShopId === "" || exactShopId === null || exactType === "" || exactType === null ? (
                ""
              ) : (
                <BottomBar />
              )
            }

          </div>
    </>
  );
}

export default App;
