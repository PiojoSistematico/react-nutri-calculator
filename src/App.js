import { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [heightAgeBoys, setHeightAgeBoys] = useState({});
  const [heightAgeGirls, setHeightAgeGirls] = useState({});
  const [imcAgeBoys, setImcAgeBoys] = useState({});
  const [imcAgeGirls, setImcAgeGirls] = useState({});
  const [weightAgeBoys, setWeightAgeBoys] = useState({});
  const [weightAgeGirls, setWeightAgeGirls] = useState({});
  const [weightHeightBoys02, setWeightHeightBoys02] = useState({});
  const [weightHeightBoys25, setWeightHeightBoys25] = useState({});
  const [weightHeightGirls02, setWeightHeightGirls02] = useState({});
  const [weightHeightGirls25, setWeightHeightGirls25] = useState({});

  const [patientGender, setPatientGender] = useState("Male");
  const [patientAge, setPatientAge] = useState(0);
  const [patientIMC, setPatientIMC] = useState(0);
  const [weightZScore, setWeightZScore] = useState(0);
  const [heightZScore, setHeightZScore] = useState(0);
  const [weightHeightZScore, setWeightHeightZScore] = useState(0);
  const [imcZScore, setImcZScore] = useState(0);

  const patientWeightRef = useRef();
  const patientHeightRef = useRef();
  const dateRef = useRef();

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

  function calculateIMC(e) {
    e.preventDefault();
    setPatientIMC(
      patientWeightRef.current.value /
        (patientHeightRef.current.value / 100) ** 2
    );
    //Calculating the age in months
    const today = new Date();
    const dob = new Date(dateRef.current.value);
    const yearsDifference = today.getFullYear() - dob.getFullYear();
    const monthsDifference = today.getMonth() - dob.getMonth();
    const daysDifference = today.getDate() - dob.getDate();
    let monthCorrection = 0;
    //If the day difference between the 2 months is negative, the last month is not a whole month.
    if (daysDifference < 0) monthCorrection = -1;
    const months = yearsDifference * 12 + monthsDifference + monthCorrection;
    setPatientAge(months);

    //Processing data differently if months is less than 60 (5 years old)
    let valueM, valueL, valueS;
    if (months > 60) {
      setHeightZScore(0);
      setWeightZScore(0);
      setWeightHeightZScore(0);
      //TODO get the proper gender from the form
      valueM =
        patientGender === "Boy"
          ? imcAgeBoys[patientAge]["M"]
          : imcAgeGirls[patientAge]["M"];
      valueL =
        patientGender === "Boy"
          ? imcAgeBoys[patientAge]["L"]
          : imcAgeGirls[patientAge]["L"];
      valueS =
        patientGender === "Boy"
          ? imcAgeBoys[patientAge]["S"]
          : imcAgeGirls[patientAge]["S"];
      setImcZScore(((patientIMC / valueM) ** valueL - 1) / (valueL * valueS));
      console.log("IMC", patientAge, patientGender, typeof patientGender);
      return;
    }
    setImcZScore(0);
    valueM =
      patientGender === "Boy"
        ? weightAgeBoys[patientAge]["M"]
        : weightAgeGirls[patientAge]["M"];
    valueL =
      patientGender === "Boy"
        ? weightAgeBoys[patientAge]["L"]
        : weightAgeGirls[patientAge]["L"];
    valueS =
      patientGender === "Boy"
        ? weightAgeBoys[patientAge]["S"]
        : weightAgeGirls[patientAge]["S"];
    setWeightZScore(
      ((patientWeightRef.current.value / valueM) ** valueL - 1) /
        (valueL * valueS)
    );
    valueM =
      patientGender === "Boy"
        ? heightAgeBoys[patientAge]["M"]
        : heightAgeGirls[patientAge]["M"];
    valueL =
      patientGender === "Boy"
        ? heightAgeBoys[patientAge]["L"]
        : heightAgeGirls[patientAge]["L"];
    valueS =
      patientGender === "Boy"
        ? heightAgeBoys[patientAge]["S"]
        : heightAgeGirls[patientAge]["S"];
    setHeightZScore(
      ((patientHeightRef.current.value / valueM) ** valueL - 1) /
        (valueL * valueS)
    );
    if (months > 24) {
      valueM =
        patientGender === "Boy"
          ? weightHeightBoys02[patientHeightRef.current.value]["M"]
          : weightHeightGirls02[patientHeightRef.current.value]["M"];
      valueL =
        patientGender === "Boy"
          ? weightHeightBoys02[patientHeightRef.current.value]["L"]
          : weightHeightGirls02[patientHeightRef.current.value]["L"];
      valueS =
        patientGender === "Boy"
          ? weightHeightBoys02[patientHeightRef.current.value]["S"]
          : weightHeightGirls02[patientHeightRef.current.value]["S"];
      console.log("less than 60", patientHeightRef.current.value);
      setWeightHeightZScore(
        ((patientWeightRef.current.value / valueM) ** valueL - 1) /
          (valueL * valueS)
      );
    } else {
      valueM =
        patientGender === "Boy"
          ? weightHeightBoys25[patientHeightRef.current.value]["M"]
          : weightHeightGirls25[patientHeightRef.current.value]["M"];
      valueL =
        patientGender === "Boy"
          ? weightHeightBoys25[patientHeightRef.current.value]["L"]
          : weightHeightGirls25[patientHeightRef.current.value]["L"];
      valueS =
        patientGender === "Boy"
          ? weightHeightBoys25[patientHeightRef.current.value]["S"]
          : weightHeightGirls25[patientHeightRef.current.value]["S"];
      console.log("less than 60", patientHeightRef.current.value);
      setWeightHeightZScore(
        ((patientWeightRef.current.value / valueM) ** valueL - 1) /
          (valueL * valueS)
      );
    }
  }

  return (
    <div className="App">
      <h1>Hello</h1>
      <form action="">
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
        <input type="date" name="fechaNacimiento" ref={dateRef} />

        <label htmlFor="peso">Weight (Kg)</label>
        <input
          type="number"
          name="pesoActual"
          id="pesoActual"
          min="0"
          max="300"
          ref={patientWeightRef}
        />

        <label htmlFor="talla">Height (cm)</label>
        <input
          type="number"
          name="talla"
          id="talla"
          min="0"
          max="300"
          ref={patientHeightRef}
        />

        <button onClick={calculateIMC}>Calculate</button>
      </form>
      <p>
        Age = {Math.floor(patientAge / 12)} years ({patientAge} months)
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
