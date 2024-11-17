import React, { useState, useEffect } from 'react'
import axios from 'axios'
import LineGraph from '../custom/LineGraphOrder'
import LineGraphRevenue from '../custom/LineGraphRevenue'
import Onlinegraph from '../custom/Onlinegraph'
import NorthIcon from '@mui/icons-material/North';
import SouthIcon from '@mui/icons-material/South';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import {
  getAccessSuccess,
  getAccessFail
} from '../redux/actions/userAction'
import { useSelector,useDispatch } from 'react-redux';

const Dashboard = () => {
  const dispatch = useDispatch()
  const [userCount, setUserCount] = useState("")
  const [prdouctCout, setProductCount] = useState("")
  const [orderCount, setOrderCount] = useState("")
  const [year, setYear] = useState(new Date().getFullYear())
  const [platId, setPlatid] = useState(1)

  const [totalRevenue, setTotalRevenue] = useState(0)
  const [ordersGraph, setOrdersGraph] = useState([])
  const [onlineGraph, setOnlineGraph] = useState([])
  const [onlineRev, setOnlineRev] = useState("")
  const [platForms, setPlatforms] = useState([])
  const adminId = localStorage.getItem("adminId");
  const shop_id = localStorage.getItem("shop_id");
  const type = localStorage.getItem("type");
  const adminToken = localStorage.getItem("adminToken")

  const getDetails = async () => {
    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${adminToken}` // Bearer Token Format
        }
      };
      const response = await axios.get(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/getdashbordDetails?type=${type}&shop_id=${shop_id}&year=${year}&adminId=${adminId}`, config);
      if (response.status === 200) {
        setUserCount(response.data.users)
        setProductCount(response.data.products)
        setOrderCount(response.data.orders)
        setOrdersGraph(response.data.result)
        setTotalRevenue(response.data.totalRevenue)
      }
    } catch (error) {
      console.log(error)
    }
  }



  const getDetails1 = async () => {
    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${adminToken}` // Bearer Token Format
        }
      };
      const response = await axios.get(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/graphs?type=${type}&shop_id=${shop_id}&adminId=${adminId}&platformId=${platId}&year=${year}`, config);
      if (response.status === 200) {
        setOnlineGraph(response.data.result)
        setOnlineRev(response.data.totalrevenue)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getAllPlatforms = async () => {
    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${adminToken}` // Bearer Token Format
        }
      };
      const response = await axios.get(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/platforms?shop_id=${shop_id}&adminId=${adminId}`, config);
      if (response.status === 200) {
        setPlatforms(response.data.data)
      }

    } catch (error) {

      setPlatforms([])


    }
  }

  
  const handleAccess = async () => {
    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${adminToken}` // Bearer Token Format
        }
      };
      const response = await axios.get(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/access?shop_id=${shop_id}&adminId=${adminId}`, config);
      if (response.status === 200) {
        dispatch(getAccessSuccess(response.data.data))
      }

    } catch (error) {
      dispatch(getAccessFail(error.response.data.message))
      console.log(error)
    }
  }

  console.log("onlineGraph", onlineGraph)

  useEffect(() => {
    getDetails()
  }, [year])

  useEffect(() => {
    getDetails1()
  }, [platId,year])

  useEffect(() => {
    getAllPlatforms()
    handleAccess()
  }, [])


  return (
    <>
      <div className="row">
        <div class="main-content">
          <div class="container2">
            <div class="stats">
              <div class="stat-item">
                <div class="stat-circle">{userCount >= 1000 ? `${userCount}k+` : `${userCount}`}</div>
                <div class="stat-label">Users</div>
              </div>
              <div class="stat-item">
                <div class="stat-circle">{prdouctCout >= 1000 ? `${prdouctCout}k+` : `${prdouctCout}`}</div>
                <div class="stat-label">Products</div>
              </div>
              <div class="stat-item">
                <div class="stat-circle">{orderCount >= 1000 ? `${orderCount}k+` : `${orderCount}`}</div>
                <div class="stat-label">Orders</div>
              </div>
            </div>

            {/* <div class="section">
              <h2>Revenue</h2>
              <div className=''>
                Year : 
                 
                <select value={year} onChange={(e)=>setYear(e.target.value)}>
                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                  <option value="2028">2028</option>

                </select>
              </div>
          
              {
                ordersGraph && ordersGraph.length > 0 ? (<LineGraphRevenue ordersGraph={ordersGraph} />) : ("")
              }
            </div>
            <div class="section">
              <h2>Orders</h2>
              


              {
                ordersGraph && ordersGraph.length > 0 ? (<LineGraph ordersGraph={ordersGraph} />) : ("")
              }


            </div> */}


          </div>
        </div>

      </div>

      <div className="row mt-5">
        <div class="main-content">
          <div class="container2">
            <div className="row">
              <div className=''>
                Year :

                <select value={year} onChange={(e) => setYear(e.target.value)}>
                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                  <option value="2028">2028</option>

                </select> till {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </div>
             
              <div className="col-6">
                <h2>Revenue</h2>
                <div className="col">

                  Total Revenue : ₹ {totalRevenue}

                </div>
                {
                  ordersGraph && ordersGraph.length > 0 ? (<LineGraphRevenue ordersGraph={ordersGraph} />) : ("")
                }
              </div>
              <div className="col-6">

                <h2>Orders</h2>
                <div className="col">

                  Total Orders - {orderCount}

                </div>
                {
                  ordersGraph && ordersGraph.length > 0 ? (<LineGraph ordersGraph={ordersGraph} />) : ("")
                }
              </div>


            </div>
            <div className='row'>
              <div className='col'>
                Platform  :
                {
                  <select value={platId} onChange={(e) => setPlatid(e.target.value)}>
                    {
                      platForms && platForms.map((ele) => (
                        <option value={ele.value}>{ele.label}</option>
                      ))
                    }
                  </select>
                }

              </div>
              <div className=''>
      
                Year :

                <select value={year} onChange={(e) => setYear(e.target.value)}>
                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                  <option value="2028">2028</option>

                </select> till {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
  
              </div>
              <div className="col-6">
                <h2>Platform revenue</h2>
                <div className="col">

                  Total Revenue : ₹ {onlineRev}

                </div>
                {
                  onlineGraph && onlineGraph.length > 0 ? (<Onlinegraph onlinerevenue={onlineGraph} />) : ("")
                }
              </div>
              <div className="col-6">
                {
                  onlineGraph && onlineGraph.length > 0 ? (
                    <>
                      <div style={{ maxHeight: '40vh', overflowY: 'auto' }}>
                      <table class="table" >
                        <thead>
                          <tr>
                            <th scope="col">Month</th>
                            <th scope="col">Orders</th>
                            <th scope="col">Revenue</th>
                            <th scope="col">Revenue Difference</th>
                            <th scope="col">Stats</th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            onlineGraph && onlineGraph.map((ele) => (
                              <tr>
                                <td>{ele.month}</td>
                                <td>{ele.totalOrders}</td>
                                <td>₹ {ele.totalRevenue.toFixed(2)}</td>
                                <td>₹ {Math.abs(ele.revDiff).toFixed(2)}</td>
                                <td>
                                  {
                                    ele.diffpercentage === 0 || ele.diffpercentage < 0 ? (
                                      <span style={{color:ele.color_code}}>
                                        {ele.diffpercentage} %<NorthIcon />
                                      </span>
                                    ) : ele.diffpercentage === 50 || ele.diffpercentage < 50 ?
                                      (
                                        <span style={{color:ele.color_code}}>
                                           {ele.diffpercentage} %<TrendingUpIcon/>
                                        </span>
                                      ) :
                                      (
                                        <span style={{color:ele.color_code}}>
                                           {ele.diffpercentage} %<SouthIcon />
                                        </span>
                                      )
                                  }
                                </td>
                              </tr>
                            ))
                          }

                        </tbody>
                      </table>
                      </div>
                    </>
                  ) : ("")
                }

              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}

export default Dashboard