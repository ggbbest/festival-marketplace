import React from "react";

const AccountDetails = ({ accountAddress, accountBalance }) => {
  return (
    <div>
      <div className="jumbotron">
        <h1 className="display-5">NFT2.C4EI.NET</h1>
        <p className="lead">
          
        </p>
        <hr className="my-4" />
        <p className="lead">Account address :</p>
        <h4>{accountAddress}</h4>
        <p className="lead">Account balance :</p>
        <h4>{accountBalance} C4EI</h4>
      </div>
    </div>
  );
};

export default AccountDetails;
