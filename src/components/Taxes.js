import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Taxes = () => {

  const [sgst, setSgst] = useState(0)
  const [cgst, setCgst] = useState(0)
  const [value1, setValue1] = useState(0)
  const [value2, setValue2] = useState(0)
  const adminId = localStorage.getItem("adminId");
  const [ref,setRef] = useState(0)

  const updateTax = async () => {

    try {

      let json = {
        sgst: sgst,
        cgst: cgst,
        cgstvalue: value1,
        sgstvalue: value2
      }

      const response = await axios.put(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/update_tax?adminId=${adminId}`, json, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 201) {
        alert("Tax Updated")
        setRef((new Date().getSeconds()))
        setSgst(0)
        setCgst(0)
        setValue1(0)
        setValue2(0)
      }
    } catch (error) {
      console.log(error)
      alert("Oops..Something went wrong")
    }
  }


  const getTax = async () => {

    try {
      const response = await axios.get(`${process.env.REACT_APP_PRODUCTION_URL}/api/v1/get_tax?adminId=${adminId}`);
      if (response.status === 200) {
        setSgst(response.data.data.sgst)
        setCgst(response.data.data.cgst)
        setValue1(response.data.data.sgstvalue)
        setValue2(response.data.data.cgstvalue)
      }

    } catch (error) {
      console.log(error)
      setSgst(0)
      setCgst(0)
      setValue1(0)
      setValue2(0)
    }


  }

  useEffect(() => {
    getTax()
  }, [ref])
  


  useEffect(() => {

    if (sgst || cgst) {
      setValue1(0)
      setValue2(0)
    }

    if (sgst) {
      setValue1(sgst / 100)
    }
    if (cgst) {
      setValue2(cgst / 100)
    }
  }, [sgst, cgst])


  return (

    <>
      <div class="container text-center">
        <h1>Add Tax</h1>
        <div class="row">
          <div class="col">
            <p>SGST : <input type="number" name="sgst" value={sgst} onChange={(e) => setSgst(e.target.value)} />%</p>
          </div>
          <div class="col">
            <p>Value : <input type="number" name="sgst" value={value1} readOnly /></p>
          </div>

        </div>
        <div class="row">
          <div class="col">
            <p>CGST : <input type="number" value={cgst} onChange={(e) => setCgst(e.target.value)} />%</p>
          </div>
          <div class="col">
            <p>Value : <input type="number" value={value2} readOnly /></p>
          </div>

        </div>
        <button type="button" className='btn btn-primary' onClick={updateTax}>Save</button>
      </div>
    </>
  )
}

export default Taxes