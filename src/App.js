import React,{useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import CreateProduct from './components/CreateProduct';
import Sidenav from './components/Sidenav';
import { Routes, Route } from "react-router-dom";
import AllProduct from './components/AllProduct';
import AllUsers from './components/AllUsers';
import Tags from './components/Tags';
import { useParams } from 'react-router-dom'
import Settings from './components/Settings';
import { useLocation } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import EditProduct from './components/EditProduct';
import ViewProduct from './components/ViewProduct';



function App() {
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search); // Parse query parameters
  const type = queryParams.get('type');
  const adminId = queryParams.get('adminId');
  const shop_id = queryParams.get('shop_id');


  useEffect(() => {
    if (adminId && shop_id && type) {

      localStorage.setItem("adminId", window.atob(adminId))
      localStorage.setItem("shop_id", window.atob(shop_id))
      localStorage.setItem("type", window.atob(type))
    }

  }, [adminId,
    shop_id,
    type])
    console.log("type, adminId, shop_id ---App.js", type, adminId, shop_id)

  return (
    <>

   
      <div id="app" style={({ height: "100vh" })}>
          <div className="admin-box">
              <div className="admin-sidebar">
                   <Sidenav />
              </div>

              <div className="admin-content">
              <main>
          
          <div style={{  }}>
           
            <Routes>
            <Route exact={true} path={`/`} element={<Dashboard />} />
              <Route exact={true} path={`/create`} element={<CreateProduct />} />
              <Route exact={true} path="/allproducts" element={<AllProduct />} />
              <Route exact={true} path="/updateproduct/:id" element={<EditProduct/>} />
              <Route exact={true} path="/vewProduct/:id" element={<ViewProduct/>} />
              <Route exact={true} path="/allusers" element={<AllUsers />} />
              <Route exact={true} path="/tags" element={<Tags />} />
              <Route exact={true} path="/settings" element={<Settings />} />

            </Routes>
          </div>
        </main>
              </div>
          </div>


       
       
       
      </div>
    </>
  );
}

export default App;
