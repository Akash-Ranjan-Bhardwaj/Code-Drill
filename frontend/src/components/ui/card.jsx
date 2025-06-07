import React from "react";

export const Card = ({ className = "", children }) => {
  return (
    <div className={`card bg-base-200 shadow-xl ${className}`}>
      {children}
    </div>
  );
};

export const CardContent = ({ className = "", children }) => {
  return <div className={`card-body ${className}`}>{children}</div>;
};
