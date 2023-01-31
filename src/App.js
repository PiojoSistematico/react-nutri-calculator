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

  const [patientAge, setPatientAge] = useState(0);
  const [patientIMC, setPatientIMC] = useState(0);
  const [patientZScore, setPatientZScore] = useState(0);

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
    setPatientAge(yearsDifference * 12 + monthsDifference + monthCorrection);

    //Processing data differently if patient age is less than 60 (5 years old)
    //TODO
  }

  return (
    <div className="App">
      <h1>Hello</h1>
      <form action="">
        <label>Gender</label>
        <label for="gender1">
          <input type="radio" id="gender1" name="gender" value="Man" checked />
          Man
        </label>
        <label for="gender2">
          <input type="radio" id="gender2" name="gender" value="Woman" />
          Woman
        </label>

        <label for="fechaNacimiento">Date of Birth</label>
        <input type="date" name="fechaNacimiento" ref={dateRef} />

        <label for="peso">Weight (Kg)</label>
        <input
          type="number"
          name="pesoActual"
          id="pesoActual"
          min="0"
          max="300"
          ref={patientWeightRef}
        />

        <label for="talla">Height (cm)</label>
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
    </div>
  );
}

export default App;
