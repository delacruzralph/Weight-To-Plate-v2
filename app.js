// Plates represented as kg object yes
// Plates represented as lg object yes
// Plate as a object that takes in weight, amount per side, and included? yes
// Generate plate amount rows with each row being a unique weight + its attributes
// Increment + Decrement 
// create IView and views for kg and lb
// controller last
// event handlers section

// Model Interface
let currentModel = null;
function setModel(model) {
  currentModel = model;
}

class Plate {
  constructor(weight, perSide, included) {
    this.weight = weight;
    this.perSide = perSide;
    this.included = included;
  }

  getWeight() {
    return this.weight;
  }

  getPerSide() {
    return this.perSide;
  }

  isIncluded() {
    return this.included;
  }

  setPerSide(amount) {
    this.perSide = amount;
  }

  setIncluded(included) {
    this.included = included;
  }
}

class Model {
  constructor(totalWeight, barbellWeight, weights) {
    this.totalWeight = totalWeight;
    this.barbellWeight = barbellWeight;
    this.weights = weights;
    this.plates = this.weights.map(num => {
      return new Plate(num, 0, true);
    });
  }

  getPlates() {
    return this.plates;
  }

  getBarbellWeight() {
    return this.barbellWeight;
  }

  getTotalWeight() {
    return this.totalWeight;
  }

  setTotalWeight(weight) {
    this.totalWeight = weight;
  }

  setBarbellWeight(weight) {
    this.barbellWeight = weight;
  }

  calculatePlates() {
    let remainingWeight = this.totalWeight - this.barbellWeight;
    remainingWeight = remainingWeight / 2;
    this.plates.forEach(plate => {
      while (remainingWeight - plate['weight'] >= 0) {
        plate['perSide'] += 1
        remainingWeight -= plate['weight'];
      }
    })
    console.log(this.plates);
  }

  increaseRowPerSide(index) {
    console.log('increasing: ' + this.plates[index]['perSide'])
    // this.plates[index]['perSide'] += 1;
  }

  decreaseRowPerSide(index) {
    console.log('decreasing: ' + this.plates[index]['perSide'])
    // this.plates[index]['perSide'] -= 1;
  }

  toggleIncluded(index) {
    console.log('toggling: ' + this.plates[index]['included'])
    console.log('to: ' + !this.plates[index]['included'])
  }
}

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  renderRows() {
    const platesData = this.model.getPlates();
    this.view.renderRows(platesData);
  }

  decreaseRowPerSide(index) {
    this.model.decreaseRowPerSide(index);
    // this.renderRows();  
    console.log("index: " + index);
  }

  increaseRowPerSide(index) {
    this.model.increaseRowPerSide(index);
    // this.renderRows();
    console.log("index: " + index);
  }

  toggleIncluded(index) {
    this.model.toggleIncluded(index);
    console.log("index: " + index);
    // this.renderRows();
  }

  toggleUnit(unit) {
    this.model = new Model(targetWeight, barbellWeight, weights);
    // this.renderRows();
  }
}

class View {
  constructor() {
    this.container = document.querySelector(".plate-count-section");
  }

  renderRows(platesData) {
    platesData.map((plate, index) => {
      return this.renderRow(plate, index);
    })
  }

  renderRow(plateData, index) {
    const row = document.createElement('div');
    row.classList.add('row', 'mb-4', 'text-center', 'd-flex', 'align-items-center');
    row.dataset.index = index;

    const valueColumn = document.createElement('span');
    valueColumn.classList.add('col-3');
    valueColumn.textContent = plateData['weight'];
    row.appendChild(valueColumn);

    const inputColumn = document.createElement('div');
    inputColumn.classList.add('col-6');

    const minusButton = document.createElement('button');
    minusButton.classList.add('btn', 'btn-primary');
    minusButton.textContent = '-';
    inputColumn.appendChild(minusButton);

    const valueSpan = document.createElement('span');
    valueSpan.textContent = plateData['perSide'];
    valueSpan.classList.add('mx-3');
    inputColumn.appendChild(valueSpan);

    const plusButton = document.createElement('button');
    plusButton.classList.add('btn', 'btn-primary');
    plusButton.textContent = '+';
    inputColumn.appendChild(plusButton);

    row.appendChild(inputColumn);

    const checkboxColumn = document.createElement('div');
    checkboxColumn.classList.add('col-3');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('form-control');
    checkbox.checked = plateData['included'];
    checkboxColumn.appendChild(checkbox);

    row.appendChild(checkboxColumn);

    this.container.appendChild(row);
  }
}

// Target Weight Load
document.querySelector('#main-weight').addEventListener('input', function (e) {
  console.log(e.target.value);
});

// jQuery for toggle button for unit (kg/lb);
$(function () {
  $(document).on('click', '.btn-toggle', function (event) {
    event.preventDefault();
    $(this).find('.btn').toggleClass('active');

    if ($(this).find('.btn-primary').length > 0) {
      $(this).find('.btn').toggleClass('btn-primary');
    }

    $(this).find('.btn').toggleClass('btn-default');

    let unit = $(this).find('.active');
    console.log(unit[0].textContent);
    controller.toggleUnit(unit);
  });

  $(document).on('click', '#more-settings-btn', function (event) {
    event.preventDefault();
    // your code to handle the button click goes here
  });
});

// attach a single event listener to the parent container using event delegation
document.getElementById('plate-count-section').addEventListener('click', (event) => {
  const target = event.target;
  const index = target.closest('.row').dataset.index;
  if (target.tagName === 'BUTTON') {
    if (target.textContent === '-') {
      console.log('minus')
      controller.decreaseRowPerSide(index);
    } else if (target.textContent === '+') {
      console.log('plus')
      controller.increaseRowPerSide(index);
    }
  } else if (target.tagName === 'INPUT') {
    console.log('toggling');
    controller.toggleIncluded(index);
  }
});

// Tests
const modelKg = new Model(100, 25, [25, 20, 15, 10, 5, 2.5, 1.25, 0.5, 0.25]);
console.log(modelKg.getPlates());
console.log(modelKg.getBarbellWeight());
console.log(modelKg.getTotalWeight());
modelKg.calculatePlates();

const modelLb = new Model(135, 45, [45, 35, 25, 10, 5, 2.5]);
console.log(modelLb.getPlates());
console.log(modelLb.getBarbellWeight());
console.log(modelLb.getTotalWeight());
modelLb.calculatePlates();

const view = new View();
const controller = new Controller(modelKg, view);
controller.renderRows();