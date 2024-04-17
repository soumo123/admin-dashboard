import logo from './logo.svg';
import './App.css';
import CreateProduct from './components/CreateProduct';
import Sidenav from './components/Sidenav';
import { Routes, Route } from "react-router-dom";
import AllProduct from './components/AllProduct';
import AllUsers from './components/AllUsers';
import Tags from './components/Tags';
import {useParams} from 'react-router-dom'


function App() {

  const { adminId , id, type } = useParams();

  console.log(" adminId , id, type ---App.js" ,  adminId , id, type )

  return (
    <>
  
    <Sidenav />
      <Routes>
      <Route exact={true} path={`/:adminId/:id/:type`} element={<Sidenav />} />
        <Route exact={true} path={`/create`} element={<CreateProduct />} />
        <Route exact={true} path="/allproducts" element={<AllProduct />} />
        <Route exact={true} path="/allusers" element={<AllUsers />} />
        <Route exact={true} path="/tags" element={<Tags />} />


      </Routes>
    </>
  );
}

export default App;
