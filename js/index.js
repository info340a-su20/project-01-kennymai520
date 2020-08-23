'use strict';

let givenState = 'Alabama';
let givenRange = '7';
let givenType = 'Confirmed';

let URL2 = "https://covidtracking.com/api/us";

fetch(URL2)
.then(function(response) {
  return response.json();
}).then (function(data) {
  let time = document.querySelector('#case_time');
  time.textContent = 'Updated August ' + new Date(data[0].dateChecked);
  document.querySelector('#total_cases').textContent = numberWithCommas(data[0].positive);
  document.querySelector('#total_death').textContent = numberWithCommas(data[0].death);
  // console.log(data);
});

// formattting with commas on thousand for numbers.
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


let form = document.querySelector('#email_form');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  window.alert("You will be receiving Covid-19 news update");
  form.reset();
});


//initialize plot
fetchData('Alabama', 'Confirmed', '7');

function fetchData(stateName, typeName, range) {
  let promise = d3.csv("https://raw.githubusercontent.com/kennymai520/testing/master/14day_cases_count.csv");
  promise.then((data) => {
    let filterState = data.filter((item) => {return item.Province_State == '' + stateName});
    // filter to 7 day or 14 day
    let filterRange = filterState.slice(0, parseInt(range));
    // extract the date and confirmed cases as x and y stored in array of object.
    let dataPoints = [];
    filterRange.map((oneDay) => {
      let components = {
        date: new Date(oneDay.Date),
        count: parseInt(oneDay[typeName])
      }
      dataPoints.push(components);
    });
    window.onload(dataPoints, givenState).render();
    // console.log(dataPoints);
  })
}

// window.onload = function (inputs, statename) {
//   let chart = new CanvasJS.Chart("chartContainer", {
//     animationEnabled: true,
//     theme: "light2",
//     title:{
//       text: "Daily Updates in " + statename
//     },
//     data: [{
//       type: "line",
//       indexLabelFontSize: 16,
//       dataPoints: inputs
//     }]
//   });
//   chart.render();
// }

window.onload = function (inputs, statename) {
  window.document.body.onload = makeGraph;
  function makeGraph (inputs, statename) {
    let datas = [];
    for (let i = 0; i < inputs.length; i++) {
      datas.push({x: inputs[i].date, y: inputs[i].count});
    }
    // console.log(datas);
    let chart = new CanvasJS.Chart("chartContainer", {
      animationEnabled: true,
      theme: "light2",
      title:{
        text: "Daily Updates in " + statename
      },
      data: [{        
        type: "line",
        indexLabelFontSize: 16,
        dataPoints: datas
      }]
    });
    console.log("Graph rendered");
    return chart;
  }
}

let selectState = document.querySelector('#stateSelector');
selectState.addEventListener('change', (event) => {
  fetchData(event.target.value, givenType, givenRange);
  givenState = event.target.value;
  console.log(givenState);
});

let selectCases = document.querySelector('#typeSelector');
selectCases.addEventListener('change', (event) => {
  fetchData(givenState, event.target.value, givenRange);
  givenType = event.target.value;
  console.log(givenType);
})

let selectRange = document.querySelector('#rangeSelector');
selectRange.addEventListener('change', (event) => {
  fetchData(givenState, givenType, event.target.value);
  givenRange = event.target.value;
  console.log(givenRange);
})
