'use strict';

let givenState = 'Alabama';
let givenRange = '7';
let givenType = 'Confirmed';

// this version does not work due to the website header doesn't set access-control-allow-origin
// nothing we can do from client side.
// let URL3 = "https://covidtracking.com/api/us/daily";

// fetch(URL3)
// .then(function(response) {
//   return response.json();
// }).then (function(data) {
//   let time = document.querySelector('#case_time');
//   time.textContent = 'Updated August ' + new Date(data[0].dateChecked);
//   document.querySelector('#total_cases').textContent = numberWithCommas(data[0].positive);
//   document.querySelector('#total_death').textContent = numberWithCommas(data[0].death);
//   console.log(data);
// }) .catch((err) => {
//   alert(err);
// });

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

  let promise_death = d3.csv("https://covid.ourworldindata.org/data/ecdc/total_deaths.csv");
  promise_death.then((data) => {
    return data[data.length - 1];
  }).then((data) => {
    let time = document.querySelector('#case_time');
    time.textContent = 'Updated ' + new Date(data.date);
    document.querySelector('#total_death').textContent = numberWithCommas(data['United States']);
  });
}

// version that does not render when page first load 
// function fetchData(stateName, typeName, range) {
//   let promise = d3.csv("https://raw.githubusercontent.com/kennymai520/testing/master/14day_cases_count.csv");
//   promise.then((data) => {
//     let filterState = data.filter((item) => {return item.Province_State == '' + stateName});
//     // filter to 7 day or 14 day
//     let filterRange = filterState.slice(0, parseInt(range));
//     // extract the date and confirmed cases as x and y stored in array of object.
//     let dataPoints = [];
//     filterRange.map((oneDay) => {
//       let components = {
//         date: new Date(oneDay.Date),
//         count: parseInt(oneDay[typeName])
//       }
//       dataPoints.push(components);
//     });
//     window.onload(dataPoints, givenState);
//     console.log(dataPoints);
//   })
// }

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

// window.onload = function (inputs, statename) {
//   window.document.body.onload = makeGraph;
//   function makeGraph (inputs, statename) {
//     let datas = [];
//     for (let i = 0; i < inputs.length; i++) {
//       datas.push({x: inputs[i].date, y: inputs[i].count});
//     }
//     // console.log(datas);
//     let chart = new CanvasJS.Chart("chartContainer", {
//       animationEnabled: true,
//       theme: "light2",
//       title:{
//         text: "Daily Updates in " + statename
//       },
//       data: [{        
//         type: "line",
//         indexLabelFontSize: 16,
//         dataPoints: datas
//       }]
//     });
//     console.log("Graph rendered");
//     chart.render();
//   }
// }


//initialize plot
fetchData2('Alabama', 'Confirmed', '7');

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
