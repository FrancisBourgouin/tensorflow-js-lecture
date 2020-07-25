import React, { useState } from 'react';
import { CSSTransition } from 'react-transition-group'
const Fingers = () => {
  // return (
  //   <div className="Fingers">

  //   </div>
  // );

  const [inProp, setInProp] = useState(false);
  const nodeRef = React.useRef(null)
  return (
    <div>
      <CSSTransition nodeRef={nodeRef} in={inProp} timeout={2000} classNames="my-node">
        <div>
          {"I'll receive my-node-* classes"}
        </div>
      </CSSTransition>
      <button type="button" onClick={() => setInProp(true)}>
        Click to Enter
      </button>
    </div>
  );
}

export default Fingers;