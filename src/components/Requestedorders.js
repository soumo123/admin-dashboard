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
      {/* <h1>Requested Orders to Agents</h1>
      <div className='container'>
        <div className='row'> 
          <div className='col table-responsive-lg'>
            <table class="table table-warning table data-tables">
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
                          loading....
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
                              <tr key={ele?._id}>

                                <td>{ele?.agentInfo?.agentname} {`(${ele?.agentInfo?.agentId})`}</td>
                                <td>{ele?.agentInfo?.email}</td>
                                <td>{ele?.agentInfo?.phone}</td>
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
          </div>
        </div>
      </div> */}

      <div className={`all-product`}>
        <h3>Requested Orders to Agents</h3>
        <div class="row align-items-center">
          <div class="col-12 col-md-4 mb-3 mb-md-0">

          </div>
          <div class="col-12 col-md-4 mb-3 mb-md-0">

          </div>
          <div class="col-12 col-md-4">

          </div>
        </div>

        <div className="table-responsive">
          <table className="table custom-table-header">
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
                        loading....
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
                            <tr key={ele?._id}>

                              <td>{ele?.agentInfo?.agentname} {`(${ele?.agentInfo?.agentId})`}</td>
                              <td>{ele?.agentInfo?.email}</td>
                              <td>{ele?.agentInfo?.phone}</td>
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
        </div>
          <Pagination count={totalPages} variant="outlined" color="secondary" onChange={handlePageChange} />
      </div>



    </>
  )
}

export default Requestedorders
