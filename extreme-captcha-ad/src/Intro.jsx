import React, { useState } from 'react';
import { photoCredits } from "./helpers"
import { useEffect } from 'react';

const Intro = ({ setView }) => {
  const [formState, setFormState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    registerHover: false
  })
  const { firstName, lastName, email, registerHover } = formState

  // Presentation stage
  // 0 - Initial + form filling
  // 1 - h2 + register hover
  // 2 - captcha
  // 3 - WTH
  // 4 - infomercial

  const [presentationStage, setPresentationStage] = useState(0)

  const textFieldAnimation = (fieldName, text, timing = 100) => {
    const letters = Array.from(text)
    let output = ""
    letters.forEach((letter, index) => {
      setTimeout(() => {
        output += letter
        setFormState(prev => ({ ...prev, [fieldName]: output }))
      }, index * timing)
    })
  }

  useEffect(() => {
    let timing = 0
    const fieldList = [
      { text: "Francis", fieldName: "firstName" },
      { text: "Bourgouin", fieldName: "lastName" },
      { text: "info@francisbourgouin.com", fieldName: "email" }
    ]
    // Input fields

    for (const { text, fieldName } of fieldList) {
      setTimeout(() => textFieldAnimation(fieldName, text), timing)
      timing += (text.length + 2) * 100 // or custom timing value
    }

    // Submit color change

    setTimeout(() => setPresentationStage(1), timing)

    timing += 300
    // CAPTCHA appearing

    setTimeout(() => setPresentationStage(2), timing)
    timing += 1500
    // WTH appearing

  }, [])

  const partDeux = () => {
    let timing = 800
    setPresentationStage(3)
    setTimeout(() => setPresentationStage(4), timing)

    timing += 1500
    // WTH appearing
    setTimeout(() => setPresentationStage(5), timing)
  }

  return (
    <section className="Intro">
      <h1 className={presentationStage > 3 ? 'appear appear__visible' : 'appear'}>Have you ever been in that situation...</h1>
      <form className={presentationStage > 3 ? 'sad' : ''} onSubmit={e => e.preventDefault()}>
        <input type="text" name="firstName" value={firstName} placeholder="First Name" readOnly />
        <input type="text" name="lastName" value={lastName} placeholder="Last Name" readOnly />
        <input type="text" name="email" value={email} placeholder="Email Address" readOnly />
        <input type="submit" value="Register" className={presentationStage > 0 ? 'registerHover' : ''} />
        {presentationStage > 1 &&
          <div className="fakeCaptcha">
            <h1>Click on the images that represent emptiness</h1>
            <div onClick={partDeux} style={{ backgroundImage: "url(/captcha-pics/alex-kim-d52i7z91qaQ-unsplash.jpg)" }} />
            <div onClick={partDeux} style={{ backgroundImage: "url(/captcha-pics/alice-butenko-GjeXWexbtlg-unsplash.jpg)" }} />
            <div onClick={partDeux} style={{ backgroundImage: "url(/captcha-pics/dima-pechurin-yZ3ODX1vgrA-unsplash.jpg)" }} />
            <div onClick={partDeux} style={{ backgroundImage: "url(/captcha-pics/enrico-mantegazza-B0ADZiToKgw-unsplash.jpg)" }} />
            <div onClick={partDeux} style={{ backgroundImage: "url(/captcha-pics/izz-r-VKPLOCtxJRs-unsplash.jpg)" }} />
            <div onClick={partDeux} style={{ backgroundImage: "url(/captcha-pics/jc-gellidon-0mDba9cPSec-unsplash.jpg)" }} />
            <div onClick={partDeux} style={{ backgroundImage: "url(/captcha-pics/simon-berger-DZi0rnYrpWc-unsplash.jpg)" }} />
            <div onClick={partDeux} style={{ backgroundImage: "url(/captcha-pics/valentin-lacoste-jNSJE8dMro0-unsplash.jpg)" }} />
            <div onClick={partDeux} style={{ backgroundImage: "url(/captcha-pics/xviiizz-Vgv6OOwkTqc-unsplash.jpg)" }} />
          </div>
        }
      </form>
      <h2 className={presentationStage > 3 ? 'appear appear__visible' : 'appear'}>
        Where you don't know what to answer?
      <button
          className={presentationStage > 4 ? 'appear appear__visible' : 'appear'}
          onClick={() => setView('Home')}
        >
          <span>Maybe... Yes ?</span>
          <span>(come on, just click it)</span>
        </button>

      </h2>
    </section>
  );
}

export default Intro;