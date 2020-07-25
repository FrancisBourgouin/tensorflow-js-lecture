import React, { useState, useRef } from 'react';
import { CSSTransition } from 'react-transition-group'
import Stamp from './Stamp'
import { useEffect } from 'react';

const Home = () => {
  const tfStamp = useRef(null)
  const html5Stamp = useRef(null)
  const cssStamp = useRef(null)
  const jsStamp = useRef(null)
  const [presentationStage, setPresentationStage] = useState(13)

  useEffect(() => {
    let timer = 0
    setTimeout(() => setPresentationStage(1), timer)
    timer += 800
    setTimeout(() => setPresentationStage(2), timer)
    timer += 800
    setTimeout(() => setPresentationStage(3), timer)

    //End of extreme captcha
    timer += 1500
    setTimeout(() => setPresentationStage(4), timer)
    timer += 200
    setTimeout(() => setPresentationStage(5), timer)
    timer += 200
    setTimeout(() => setPresentationStage(6), timer)
    timer += 200
    setTimeout(() => setPresentationStage(7), timer)
  }, [])
  return (
    <div className="Home" onClick={() => setPresentationStage(presentationStage + 1)}>
      {presentationStage > 0 && <h1>INTRODUCING</h1>}
      {presentationStage > 1 && <h1>EXTREME</h1>}
      {presentationStage > 2 && <h1>CAPTCHA</h1>}
      <div className="stamps">
        <CSSTransition
          nodeRef={tfStamp}
          in={presentationStage > 3}
          // timeout={200}
          classNames="Stamp"
          unmountOnExit
        >
          <Stamp
            nodeRef={tfStamp}
            borderText="POWERED BY TENSORFLOW"
            middleImg="/logos/TF_FullColor_Icon.png"
            className="tf_stamp"
            angleStep={15}
            startingAngle={-120}
          />
        </CSSTransition>
        <CSSTransition
          nodeRef={cssStamp}
          in={presentationStage > 4}
          // timeout={800}
          classNames="Stamp"
          unmountOnExit
        >
          <Stamp
            nodeRef={cssStamp}
            borderText="STYLED WITH CSS"
            middleImg="/logos/css3.png"
            className="css_stamp"
            angleStep={23}
            startingAngle={-50}
          />
        </CSSTransition>

        <CSSTransition
          nodeRef={jsStamp}
          in={presentationStage > 5}
          // timeout={300}
          classNames="Stamp"
          unmountOnExit
        >
          <Stamp
            nodeRef={jsStamp}
            borderText="WRITTEN IN JS"
            middleImg="/logos/js.png"
            className="js_stamp"
            angleStep={25}
            startingAngle={-90}
          />
        </CSSTransition>

        <CSSTransition
          nodeRef={html5Stamp}
          in={presentationStage > 6}
          // timeout={300}
          classNames="Stamp"
          unmountOnExit
        >
          <Stamp
            nodeRef={html5Stamp}
            borderText="HTML5 COMPLIANT"
            middleImg="/logos/html5.png"
            className="html5_stamp"
            angleStep={23}
            startingAngle={-50}
          />
        </CSSTransition>

      </div>
    </div>
  );
}

export default Home;