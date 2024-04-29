import React from 'react';

const Message = ({ type, message }) => {

    console.log("type, message ",type, message )

    return (
        <div
            style={{
                position: 'fixed',
                top: '1rem',
                right: '1rem',
                zIndex: 9999, // Ensure the toast is on top of other content
                backgroundColor:"#12e012"
            }}
        >
            <div
                className={`toast align-items-center text-${
                    type === 'success' ? 'success' : 'danger'
                } border-0 fade show`}
                role="alert"
                aria-live="assertive"
                aria-atomic="true"
            >
                <div className="d-flex">
                    <div className="toast-body">
                        <p>{message}</p>
                    </div>
                    <button
                        type="button"
                        className="btn-close me-2 m-auto"
                        data-bs-dismiss="toast"
                        aria-label="Close"
                    ></button>
                </div>
            </div>
        </div>
    );
};

export default Message;
