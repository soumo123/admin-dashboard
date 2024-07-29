import React, { useState, useEffect } from 'react'
import axios from 'axios'
import LineGraph from '../custom/LineGraphOrder'
import LineGraphRevenue from '../custom/LineGraphRevenue'



const Dashboard = () => {
  const [userCount, setUserCount] = useState("")
  const [prdouctCout, setProductCount] = useState("")
  const [orderCount, setOrderCount] = useState("")
  const[year,setYear] = useState(new Date().getFullYear())
  const [ordersGraph, setOrdersGraph] = useState([])
  const adminId = localStorage.getItem("adminId");
  const shop_id = localStorage.getItem("id");
  const type = localStorage.getItem("type");

  const getDetails = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/getdashbordDetails?type=${type}&shop_id=${shop_id}&year=${year}`);
      if (response.status === 200) {
        setUserCount(response.data.users)
        setProductCount(response.data.products)
        setOrderCount(response.data.orders)
        setOrdersGraph(response.data.result)
      }
    } catch (error) {
      console.log(error)
    }
  }
console.log("yearr",year)

  useEffect(() => {
    getDetails()
  }, [year])


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
            
            <div class="section">
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
              {/* <div class="box">

              </div> */}
              {
                ordersGraph && ordersGraph.length > 0 ? (<LineGraphRevenue ordersGraph={ordersGraph} />) : ("")
              }
            </div>
            <div class="section">
              <h2>Orders</h2>
              


              {
                ordersGraph && ordersGraph.length > 0 ? (<LineGraph ordersGraph={ordersGraph} />) : ("")
              }


            </div>
          </div>
        </div>

      </div>
    </>
  )
}

export default Dashboard