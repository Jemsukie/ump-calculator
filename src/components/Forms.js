import { useState } from "react";

const Form = () => {
  const [value, setValue] = useState(0);
  const [income, setIncome] = useState(0);
  const [date, setDate] = useState(setCurrentDate(new Date()));
  const [totals, setTotals] = useState();

  const topUp = (income) => {
    setValue(totals.excess);
    setIncome(income);
    setDate(setCurrentDate(totals.endDate));
  }

  return (
    <section>
      <div className="container my-5">
        <div className="d-flex justify-content-center">
          <form>
            <InputHTML
              htmlFor="latest-val"
              name="Latest Value"
              type="number"
              value={value}
              onChange={(event) => setValue(event.target.value)}
            />
            <InputHTML
              htmlFor="income"
              name="Income"
              type="number"
              value={income}
              onChange={(event) => setIncome(event.target.value)}
            />
            <InputHTML
              htmlFor="date"
              name="Date"
              type="date"
              value={date}
              onChange={(event) => setDate(setCurrentDate(new Date(event.target.value)))}
            />

            <Output totals={totals} function={topUp}/>

            <TextAreaHTML totals={totals} />

            <TextInputHTML totals={totals} />

            <div className="d-flex justify-content-center">
              <button
                className="btn btn-primary"
                onClick={(event) => {
                  event.preventDefault();
                  setTotals(calculateDays(income, value, new Date(date)));
                }}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

const InputHTML = (props) => {
    
  return (
    <div className="form-group">
      <label className="d-flex text-start" htmlFor={props.htmlFor}>{props.name}</label>
      <input
        type={props.type}
        className="form-control"
        id={props.htmlFor}
        value={props.value}
        required
        onChange={props.onChange}
      />
    </div>
  );
};

const Output = (props) => {
  if (props.totals !== undefined) {

    return (
      <div className="form-group">
        <span className="d-flex text-start">
          Total: {props.totals.totalIncome} <br />
          Days: {props.totals.totalDays} <br />
          Excess: {props.totals.excess} <br />
          Completion Date: {props.totals.endDate.toDateString()} <br />
        </span>

        <div className="justify-content-center mt-2">
          <button className="btn btn-success" onClick={(event) => {
            event.preventDefault();
            props.function(parseInt(props.totals.income) + 50);
          }}>Top up next value</button>
        </div>
      </div>
    );
  }
};

const TextAreaHTML = (props) => {
    let areaVal = '';

  if (props.totals !== undefined) {

    areaVal =
      `${props.totals.endDate.toLocaleString("default", { month: "long" })}\t${
        props.totals.endDate.toDateString().split(" ")[2]
      }\t${props.totals.totalIncome}\t${5000}\n\t\t${props.totals.excess}\t\n`;
  }

  return (
    <div className="form-outline">
      <textarea
        className="form-control"
        id="text-area"
        rows="3"
        value={areaVal}
        readOnly
        onClick={(event) => {
          copyToClipboard(areaVal);
        }}
      ></textarea>
    </div>
  );
};

const TextInputHTML = (props) => {
    let textVal = '';

    if (props.totals !== undefined) {
        let totalIncome = parseInt(props.totals.income);
        textVal = `${totalIncome * 100 + 5000}\t${
            props.totals.endDate.toDateString().split(" ")[1]
          }-${props.totals.endDate.toDateString().split(" ")[2]}\t${totalIncome + 50}`;
    }
    return(
        <div>
            <input type="text" className="form-control" id="text-field" value={textVal} readOnly onClick={(event) => {copyToClipboard(textVal)}} />
            <label className="form-label d-flex text-start" htmlFor="text-field">
                Format(Click to copy):
            </label>
        </div>
    )
}

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text);
}

const calculateDays = (income, latestVal, date) => {
  if (parseInt(income) === 0 || income === '' ) return;
  latestVal = parseInt(latestVal);

  const countDays = (5000 - latestVal) / income;
  const totalDays = countDays > parseInt(countDays) ? parseInt(countDays + 1) : countDays;
  const totalIncome = totalDays * income + latestVal;
  const excess = totalIncome - 5000;
  const endDate = getWeekend(totalDays, date);

  return { income, totalIncome, totalDays, excess, endDate };
};

const getWeekend = (totalDays, date) => {
  let days = totalDays;
  let myDate = "";

  while (days > 0) {
    const addedDate = totalDays - days + 1;

    myDate = new Date(date);
    myDate.setFullYear(date.getFullYear());
    myDate.setMonth(date.getMonth());
    myDate.setDate(date.getDate() + addedDate);

    if (myDate.getDay() === 6 || myDate.getDay() === 0) {
      myDate.setDate(date.getDate() + addedDate + 2);
      date.setDate(date.getDate() + 2);
    }
    days--;
  }
  return myDate;
};

const setCurrentDate = (date) => {
  const year = `${date.getFullYear()}`;
  const month =
    date.getMonth() + 1 < 10
      ? `0${date.getMonth() + 1}`
      : `${date.getMonth() + 1}`;
  const day = date.getDate() < 10 ? `0${date.getDate()}` : `${date.getDate()}`;
  return `${year}-${month}-${day}`;
};

export default Form;
