import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [heightAgeBoys, setHeightAgeBoys] = useState(undefined);
  const [heightAgeGirls, setHeightAgeGirls] = useState(undefined);
  const [imcAgeBoys, setImcAgeBoys] = useState(undefined);
  const [imcAgeGirls, setImcAgeGirls] = useState(undefined);
  const [weightAgeBoys, setWeightAgeBoys] = useState(undefined);
  const [weightAgeGirls, setWeightAgeGirls] = useState(undefined);
  const [weightHeightBoys02, setWeightHeightBoys02] = useState(undefined);
  const [weightHeightBoys25, setWeightHeightBoys25] = useState(undefined);
  const [weightHeightGirls02, setWeightHeightGirls02] = useState(undefined);
  const [weightHeightGirls25, setWeightHeightGirls25] = useState(undefined);

  const [patientGender, setPatientGender] = useState("Boy");
  const [dob, setDob] = useState(new Date("2015-01-17"));
  const [patientWeight, setPatientWeight] = useState(0);
  const [patientHeight, setPatientHeight] = useState(0);

  useEffect(() => {
    Promise.all([
      fetch(window.location.origin + "/heightAgeBoys.json"),
      fetch(window.location.origin + "/heightAgeGirls.json"),
      fetch(window.location.origin + "/imcAgeBoys.json"),
      fetch(window.location.origin + "/imcAgeGirls.json"),
      fetch(window.location.origin + "/weightAgeBoys.json"),
      fetch(window.location.origin + "/weightAgeGirls.json"),
      fetch(window.location.origin + "/weightHeightBoys02.json"),
      fetch(window.location.origin + "/weightHeightBoys25.json"),
      fetch(window.location.origin + "/weightHeightGirls02.json"),
      fetch(window.location.origin + "/weightHeightGirls25.json"),
    ]).then((res) => {
      res[0].json().then((data) => setHeightAgeBoys(data));
      res[1].json().then((data) => setHeightAgeGirls(data));
      res[2].json().then((data) => setImcAgeBoys(data));
      res[3].json().then((data) => setImcAgeGirls(data));
      res[4].json().then((data) => setWeightAgeBoys(data));
      res[5].json().then((data) => setWeightAgeGirls(data));
      res[6].json().then((data) => setWeightHeightBoys02(data));
      res[7].json().then((data) => setWeightHeightBoys25(data));
      res[8].json().then((data) => setWeightHeightGirls02(data));
      res[9].json().then((data) => setWeightHeightGirls25(data));
    });
  }, []);

  function handleChange(e) {
    setPatientGender(e.target.value);
  }

  function calculateAge(dobDate) {
    //Calculating the age in months
    const today = new Date();
    const dob = new Date(dobDate);
    const yearsDifference = today.getFullYear() - dob.getFullYear();
    const monthsDifference = today.getMonth() - dob.getMonth();
    const daysDifference = today.getDate() - dob.getDate();
    let monthCorrection = 0;
    //If the day difference between the 2 months is negative, the last month is not a whole month.
    if (daysDifference < 0) monthCorrection = -1;
    return yearsDifference * 12 + monthsDifference + monthCorrection;
  }

  function zScore(mean, m, l, s) {
    return mean === 0 ? 0 : ((mean / m) ** l - 1) / (l * s);
  }

  function imc(weight, height) {
    return height === 0 ? 0 : weight / (height / 100) ** 2;
  }

  let months = calculateAge(dob);
  let patientIMC = imc(patientWeight, patientHeight);
  let valueL = 0;
  let valueM = 0;
  let valueS = 0;
  let imcZScore = 0;
  let weightZScore = 0;
  let heightZScore = 0;
  let weightHeightZScore = 0;

  if (months > 60 && months < 229) {
    //IMC score
    weightZScore = 0;
    heightZScore = 0;
    weightHeightZScore = 0;
    if (patientGender === "Boy" && imcAgeBoys) {
      valueM = imcAgeBoys ? imcAgeBoys[months]["M"] : 0;
      valueL = imcAgeBoys[months]["L"];
      valueS = imcAgeBoys[months]["S"];
    }
    if (patientGender === "Girl" && imcAgeGirls) {
      valueM = imcAgeGirls[months]["M"];
      valueL = imcAgeGirls[months]["L"];
      valueS = imcAgeGirls[months]["S"];
    }
    imcZScore = zScore(patientIMC, valueM, valueL, valueS);
  } else if (months >= 0 && months <= 60) {
    //Weight score
    imcZScore = 0;
    if (patientGender === "Boy") {
      valueM = weightAgeBoys[months]["M"];
      valueL = weightAgeBoys[months]["L"];
      valueS = weightAgeBoys[months]["S"];
    } else {
      valueM = weightAgeGirls[months]["M"];
      valueL = weightAgeGirls[months]["L"];
      valueS = weightAgeGirls[months]["S"];
    }
    weightZScore = zScore(patientWeight, valueM, valueL, valueS);
    //Height score
    if (patientGender === "Boy") {
      valueM = heightAgeBoys[months]["M"];
      valueL = heightAgeBoys[months]["L"];
      valueS = heightAgeBoys[months]["S"];
    } else {
      valueM = heightAgeGirls[months]["M"];
      valueL = heightAgeGirls[months]["L"];
      valueS = heightAgeGirls[months]["S"];
    }
    heightZScore = zScore(patientHeight, valueM, valueL, valueS);
    //Weight/Height score
    if (months > 24 && patientHeight >= 65 && patientHeight <= 120) {
      if (patientGender === "Boy") {
        valueM = weightHeightBoys25[Number(patientHeight).toFixed(1)]["M"];
        valueL = weightHeightBoys25[Number(patientHeight).toFixed(1)]["L"];
        valueS = weightHeightBoys25[Number(patientHeight).toFixed(1)]["S"];
      } else {
        valueM = weightHeightGirls25[Number(patientHeight).toFixed(1)]["M"];
        valueL = weightHeightGirls25[Number(patientHeight).toFixed(1)]["L"];
        valueS = weightHeightGirls25[Number(patientHeight).toFixed(1)]["S"];
      }
      weightHeightZScore = zScore(patientWeight, valueM, valueL, valueS);
    } else if (patientHeight >= 45 && patientHeight <= 110) {
      if (patientGender === "Boy") {
        valueM = weightHeightBoys02[Number(patientHeight).toFixed(1)]["M"];
        valueL = weightHeightBoys02[Number(patientHeight).toFixed(1)]["L"];
        valueS = weightHeightBoys02[Number(patientHeight).toFixed(1)]["S"];
      } else {
        valueM = weightHeightGirls02[Number(patientHeight).toFixed(1)]["M"];
        valueL = weightHeightGirls02[Number(patientHeight).toFixed(1)]["L"];
        valueS = weightHeightGirls02[Number(patientHeight).toFixed(1)]["S"];
      }
      weightHeightZScore = zScore(patientWeight, valueM, valueL, valueS);
    }
  }

  return (
    <div className="App">
      <h1>Hello</h1>
      <section>
        <label>Gender</label>
        <label htmlFor="gender1">
          <input
            type="radio"
            id="gender1"
            name="gender"
            value="Boy"
            onChange={handleChange}
            defaultChecked
          />
          Boy
        </label>
        <label htmlFor="gender2">
          <input
            type="radio"
            id="gender2"
            name="gender"
            value="Girl"
            onChange={handleChange}
          />
          Girl
        </label>

        <label htmlFor="fechaNacimiento">Date of Birth</label>
        <input
          type="date"
          name="fechaNacimiento"
          onChange={(e) => setDob(new Date(e.target.value))}
        />

        <label htmlFor="peso">Weight (Kg)</label>
        <input
          type="number"
          name="pesoActual"
          id="pesoActual"
          min="0"
          max="300"
          onChange={(e) => setPatientWeight(e.target.value)}
        />

        <label htmlFor="talla">Height (cm)</label>
        <input
          type="number"
          name="talla"
          id="talla"
          min="0"
          max="300"
          onChange={(e) => setPatientHeight(e.target.value)}
        />

        {/* <button onClick={calculateIMC}>Calculate</button> */}
      </section>
      <p>
        Age = {Math.floor(months / 12)} years ({months} months)
      </p>
      <p>IMC = {patientIMC}</p>
      <p>Gender = {patientGender}</p>
      <p>ZSCORE (IMC) = {imcZScore}</p>
      <p>ZSCORE (Weight) = {weightZScore}</p>
      <p>ZSCORE (Height) = {heightZScore}</p>
      <p>ZSCORE (W/H) = {weightHeightZScore}</p>
    </div>
  );
}

export default App;
