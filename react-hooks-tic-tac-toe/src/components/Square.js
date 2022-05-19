import React from "react";

export default ({ value, onClick, className, isNotDisabled, isWinner }) => {
  let size = 90;
  return (
    <button
      style={{
        fontSize: `${size / 2}px`,
        lineHeight: `${size}px`,
        height: `${size}px`,
        width: `${size}px`,
      }}
      data-pro={value}
      className={className}
      onClick={onClick}
    >
      {value}
    </button>
  );
};
