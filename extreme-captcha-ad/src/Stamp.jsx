import React, { useState } from 'react';

const Stamp = ({ borderText, middleImg, className, angleStep, startingAngle, nodeRef }) => {
  const classes = `Stamp ${className}`
  const borderTextArray = Array.from(borderText)

  const parsedBorderText = borderTextArray.map((letter, index) => {
    const currentAngle = startingAngle + angleStep * index
    return <span style={{ transform: `translateX(-50%) rotate(${currentAngle}deg)` }}>{letter}</span>
  })

  return (
    <div className={classes} ref={nodeRef}>
      {parsedBorderText}
      <img src={middleImg} />
    </div>
  );
}

export default Stamp;