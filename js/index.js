'use strict';

let givenState = 'Alabama';
let givenRange = '7';
let givenType = 'Confirmed';

// formattting with commas on thousand for numbers.
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// alert user that email is being received.
let form = document.querySelector('#email_form');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  window.alert("You will be receiving Covid-19 news update");
  form.reset();
});

//updating the us confirmed case and death;
fetchUS();

function fetchUS() {
  let promise = d3.csv("https://covid.ourworldindata.org/data/ecdc/total_cases.csv");
  promise.then((data) => {
    return data[data.length - 1];
  }).then((data) => {
    let time = document.querySelector('#case_time');
    time.textContent = 'Updated ' + new Date(data.date);
    document.querySelector('#total_cases').textContent = numberWithCommas(data['United States']);
    // document.querySelector('#total_death').textContent = numberWithCommas(data[0].death);
  });

  let promiseDeath = d3.csv("https://covid.ourworldindata.org/data/ecdc/total_deaths.csv");
  promiseDeath.then((data) => {
    return data[data.length - 1];
  }).then((data) => {
    let time = document.querySelector('#case_time');
    time.textContent = 'Updated ' + new Date(data.date);
    document.querySelector('#total_death').textContent = numberWithCommas(data['United States']);
  });
}

// version two that works fine so far, and simpler code
function fetchData2(stateName, typeName, range) {
  let promise = d3.csv("https://raw.githubusercontent.com/kennymai520/testing/master/14day_cases_count.csv");
  promise.then((data) => {
    let filterState = data.filter((item) => {return item.Province_State == '' + stateName});
    // filter to 7 day or 14 day
    let filterRange = filterState.slice(0, parseInt(range));
    // extract the date and confirmed cases as x and y stored in array of object.
    let dataPoints = [];
    filterRange.map((oneDay) => {
      let components = {
        x: new Date(oneDay.Date),
        y: parseInt(oneDay[typeName])
      }
      dataPoints.push(components);
    });
    let chart = new CanvasJS.Chart("chartContainer", {
      animationEnabled: true,
      theme: "light2",
      title:{
        text: "Updates from " + stateName
      },
      data: [{        
        type: "line",
        indexLabelFontSize: 16,
        dataPoints: dataPoints
      }]
    });
    chart.render();
  });
}

//initialize plot
fetchData2('Alabama', 'Confirmed', '7');

function generateTableHead(table, data) {
  let thead = table.createTHead();
  let row = thead.insertRow();
  for (let key of data) {
    let th = document.createElement("th");
    let text = document.createTextNode(key);
    th.appendChild(text);
    row.appendChild(th);
  }
}
function generateTable(table, data) {
  for (let element of data) {
    let row = table.insertRow();
    for (let key in element) {
      let cell = row.insertCell();
      let text = document.createTextNode(element[key]);
      cell.appendChild(text);
    }
  }
}

let today = '8/18/20';
function fetchTable(givenDate) {
  let promise = d3.csv("https://raw.githubusercontent.com/kennymai520/testing/master/14day_cases_count.csv");
  promise.then((data) => {
    let latestDay = data.filter((item) => {return item.Date == givenDate;});
    let cases = [];
    latestDay.map((item) => {
      cases.push({
        Date: item.Date,
        State: item.Province_State,
        'Confirmed Cases': item.Confirmed,
        Deaths: item.Deaths
      })
    });
    let table = document.querySelector("#table_container");
    let rowName = Object.keys(cases[0]);
    generateTableHead(table, rowName);
    generateTable(table, cases);
  });
}

// initialize table
fetchTable(today);
// hiding the table at first
document.querySelector('#table_container').style.display = 'none';



let selectState = document.querySelector('#stateSelector');
selectState.addEventListener('change', (event) => {
  fetchData2(event.target.value, givenType, givenRange);
  givenState = event.target.value;
  console.log(givenState);
});

let selectCases = document.querySelector('#typeSelector');
selectCases.addEventListener('change', (event) => {
  fetchData2(givenState, event.target.value, givenRange);
  givenType = event.target.value;
  console.log(givenType);
})

let selectRange = document.querySelector('#rangeSelector');
selectRange.addEventListener('change', (event) => {
  fetchData2(givenState, givenType, event.target.value);
  givenRange = event.target.value;
  console.log(givenRange);
})

let displayTable = document.querySelector('#display_table');
displayTable.addEventListener('click', () => {
  document.querySelector('#graph_container').style.display = 'none';
  document.querySelector('#table_container').style.display = 'table';
});

let displayGraph = document.querySelector('#display_graph');
displayGraph.addEventListener('click', () => {
  document.querySelector('#table_container').style.display = 'none';
  document.querySelector('#graph_container').style.display = 'block';
});