import React, { useState, useEffect } from 'react'
import Pagination from '@mui/material/Pagination';
import axios from 'axios'

const Requestedorders = () => {
  const shop_id = localStorage.getItem("shop_id");
  const adminId = localStorage.getItem("adminId")
  const type = localStorage.getItem("type")
  const [limit, setLimit] = useState(5);
  const [offset, setOffset] = useState(0)
  const [redata, setReqdata] = useState([])
  const [totalPages, setTotalPages] = useState(0);
  const [loader, setloader] = useState(false);


  const getAllReqOrders = async () => {

    try {
      const response = await axios.get(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/inventory/get_re_orders?adminId=${adminId}&limit=${limit}&offset=${offset}`);
      if (response.status === 200) {
        setloader(true)
        setReqdata(response.data.data);
        setTotalPages(Math.ceil(response.data.totaldata / limit));
      } else {
        setloader(true)
        setReqdata([]);
      }

    } catch (error) {
      setloader(true)
      setReqdata([]);
      console.log(error)
    }


  }
  const handlePageChange = (event, value) => {
    setOffset((value - 1) * limit);
  };

  useEffect(() => {
    getAllReqOrders()
  }, [])


  return (
    <>

      <table class="table table-warning">
        <thead>
          <tr>

            <th scope="col">Agent Name</th>
            <th scope="col">Agent Email</th>
            <th scope="col">Agent Phone</th>
            <th scope="col">Quantity</th>
            <th scope="col">Message</th>

          </tr>
        </thead>
        {
          !loader ? (
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <div className="text-center">
                    No Data Found
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {
                redata && redata.length > 0 ? (
                  <tbody>
                    {
                      redata.map((ele) => (
                        <tr  key={ele?._id}>

                          <td>{ele?.agentName}</td>
                          <td>{ele?.email}</td>
                          <td>{ele?.phone}</td>
                          <td>{ele?.quantity}</td>
                          <td>{ele?.message}</td>

                        </tr>
                      ))
                    }



                  </tbody>
                ) : (
                  <div className="container">
                    <div className="row">
                      <div className="col-12">
                        <div className="text-center">
                          No Products Product Found
                        </div>
                      </div>
                    </div>
                  </div>
                )
              }

            </>
          )
        }

      </table>
      <Pagination count={totalPages} variant="outlined" color="secondary" onChange={handlePageChange} />
    </>
  )
}

export default Requestedorders