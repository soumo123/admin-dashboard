import React from 'react'
import { useNavigate } from 'react-router-dom'

const Employe = () => {
const navigate = useNavigate()
  let allTags = []

  const handleAddEmp = ()=>{
    navigate("/addemp")
  }
  return (
    <>
    
    <div className={`all-product`}>
      <h3>Employees</h3>
        <div className='form'>
          <div className="row">
            <div className="col-sm-9">
            {/* <label>Total : {totalCount}</label> */}
            </div>
            <div className="col-sm-3">
              <div className="form-group">

                <button data-toggle="tooltip" data-placement="top" title="Add Tag" className="btnSubmit" type="button" onClick={handleAddEmp}>
                  + Add employee
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="table-responsive-lg">
          <table className="table data-tables">
            <thead>
              <tr>
                <th>ID</th>
                <th>Photo</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Address</th>
                <th>State</th>
                <th>City</th>
                <th>Pincode</th>
              </tr>
            </thead>

            {/* {
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
                    allTags && allTags.length > 0 ? (
                      <tbody>
                        {allTags && allTags.map((ele, index) => (
                          <tr key={index}>

                            <td>
                              <div className="">
                                <img src={ele.thumbnailImage} style={{ width: '50%', height: '50%' }} />
                              </div>
                            </td>
                            <td>
                              {ele.label}
                            </td>
                           
                            <td>
                              <div class="form-check form-switch">
                                <input data-toggle="tooltip" data-placement="top" title="Availability" class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" value={ele.topCategory} checked={ele.topCategory} onChange={(e) => handleCategoryChange(e.target.value, ele.value)} />
                              </div>
                            </td>
                            <td>

                              <span data-toggle="tooltip" data-placement="top" title="Edit" style={{ cursor: "pointer" }} onClick={() => handleEditOpen(ele.label, ele.value, ele.thumbnailImage)}><CreateIcon /></span>
                              <span data-toggle="tooltip" data-placement="top" title="Remove" style={{ cursor: "pointer" }} onClick={() => handleOpenTagModal(ele.value)}><DeleteIcon /></span>

                            </td>

                          </tr>
                        ))}
                      </tbody>
                    ) : (
                      <div className="container">
                        <div className="row">
                          <div className="col-12">
                            <div className="text-center">
                              No employees Found
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  }
                </>
              )
            } */}

          </table>
        </div>
      </div>
    
    </>
  )
}

export default Employe