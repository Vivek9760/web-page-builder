import React from "react";

const Loader = ({ isLoading, children }) => {
  if (isLoading) {
    return (
      <div
        className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 1050 }}
      >
        <div className="text-center">
          <div className="spinner-border text-success"> </div>
          <p className="text-white mt-3">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default Loader;
