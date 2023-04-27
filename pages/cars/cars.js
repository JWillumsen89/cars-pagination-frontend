import { paginator } from "../../lib/paginator/paginate.js"
import { sanitizeStringWithTableRows } from "../../utils.js"

const SERVER_URL = "http://localhost:8080/api/car"
let TOTAL_RECORDS; 
let cars = [];
let SIZE = 5;
let SORT = 'brand';
export async function initCars(pg) {
  let TOTAL_RECORDS = await getTotalNumber(); 
  
  const inputSize = document.getElementById("number-per-site")
  inputSize.addEventListener("input", () => {
    SIZE = inputSize.value
    initCars(pg);
  });

  const inputSort = document.getElementById("sort-by")
  inputSort.addEventListener("input", () => {
    SORT = inputSort.value
    initCars(pg);
  });
  const TOTAL = Math.ceil(TOTAL_RECORDS / SIZE) 
  
  let pageNo = Number(pg) 
  //let queryString2 = `?size=4&page=0&sort=brand,asc&sort=kilometers,desc`;
  let queryString = `?size=${SIZE}&page=${pageNo - 1}&sort=${SORT},asc&sort=kilometers,desc`;
  try {
    cars = await fetch(`${SERVER_URL}${queryString}`)
      .then(res => res.json())
  } catch (e) {
    console.error(e)
  }
  const rows = cars.map(car => `
  <tr>
    <td>${car.brand}</td>
    <td>${car.model}</td>
    <td>${car.color}</td>
    <td>${car.kilometers}</td>
  `).join("")
  
  // DON'T forget to sanitize the string before inserting it into the DOM
  document.getElementById("tbody").innerHTML = sanitizeStringWithTableRows(rows)


  paginator({
    target: document.getElementById("car-paginator"),
    total: TOTAL,
    current: pageNo,
    click: initCars
  });

  // Update URL to allow for CUT AND PASTE when used with the Navigo Router (callHandler: false ensures the handler will not be called twice)
  //window.router?.navigate(`/car${queryString}`, { callHandler: false, updateBrowserURL: true })
}

async function getTotalNumber() {
  try {
    const carAmount = await fetch(`${SERVER_URL}/total`).then(res => res.json())
    if(TOTAL_RECORDS !== 1) {
      document.getElementById("cars-amount").innerHTML = `There is ${carAmount} cars`;
      } else {
        document.getElementById("cars-amount").innerHTML = `There is ${carAmount} car`;
      }
    return carAmount;
  } catch(e) {
    console.error(e)
  }
}