// Increment + Decrement 
// create IView and views for kg and lb
// controller last
// event handlers section

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
  constructor(totalWeight, barbellWeight) {
    this.totalWeight = totalWeight;
    this.barbellWeight = barbellWeight;
    const initWeights = [25, 20, 15, 10, 5, 2.5, 1.25, 0.5, 0.25];
    this.plates = this.generatePlates(initWeights);
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

  generatePlates(weights) {
    console.log(weights)
    return weights.map(num => {
      return new Plate(num, 0, true);
    });
  }

  setWeightsSelected(weights) {
    this.plates = this.generatePlates(weights);
  }

  setTotalWeight(weight) {
    this.totalWeight = weight;
    this.calculatePlates();
  }

  setBarbellWeight(weight) {
    this.barbellWeight = weight;
  }

  calculatePlates() {
    let remainingWeight = this.totalWeight - this.barbellWeight;
    this.plates.forEach(plate => {
      plate['perSide'] = plate['included'] == true ? Math.floor(remainingWeight / plate['weight'] / 2) : 0;
      remainingWeight -= plate['weight'] * plate['perSide'] * 2;
      console.log(remainingWeight);
    })

    // remainingWeight = remainingWeight / 2;
    // this.plates.forEach(plate => {
    //   plate['perSide'] = 0;
    //   if (plate['included'] == true) {
    //     console.log(remainingWeight);

    //     while (remainingWeight - (plate['weight'] * (plate['perSide'] + 1)) >= 0) {
    //       plate['perSide'] += 1
    //       remainingWeight -= (plate['weight'] * plate['perSide']);
    //       console.log(remainingWeight);
    //     }
    //   } else {
    //     plate['perSide'] = 0;
    //   }
    // })
  }

  increaseRowPerSide(index) {
    this.plates[index]['perSide'] += 1;
    this.calcNewTargetWeight();
  }

  decreaseRowPerSide(index) {
    this.plates[index]['perSide'] -= 1;
    this.calcNewTargetWeight();
  }

  toggleIncluded(index) {
    console.log(this.plates[index]);
    this.plates[index]['included'] = !this.plates[index]['included'];
    console.log(this.plates[index]);
  }

  calcNewTargetWeight() {
    let newTargetWeight = 0;
    this.plates.forEach(plate => {
      newTargetWeight += plate['weight'] * plate['perSide'];
    })
    newTargetWeight *= 2;
    newTargetWeight += this.barbellWeight;
    this.setTotalWeight(newTargetWeight);
  }
}

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.platesData = this.model.getPlates();
  }

  renderRows() {
    this.view.renderRows(this.platesData);
  }

  decreaseRowPerSide(index) {
    this.model.decreaseRowPerSide(index);
    this.view.renderRows(this.platesData);
    this.view.renderTargetWeight(this.model.getTotalWeight());
  }

  increaseRowPerSide(index) {
    this.model.increaseRowPerSide(index);
    this.view.renderRows(this.platesData);
    this.view.renderTargetWeight(this.model.getTotalWeight());
  }

  toggleIncluded(index) {
    this.model.toggleIncluded(index);
    this.model.calculatePlates();
    this.renderRows();
  }

  toggleUnit(unit) {
    const unitSelected = unit[0].textContent;
    let convertedWeight;
    let weightsSelected;
    let barbellWeight;

    // Switched to lb 
    if (unitSelected == "lb") {
      const kgToLb = 2.20462262185;
      barbellWeight = 45;
      convertedWeight = this.model.getTotalWeight() * kgToLb;
      weightsSelected = [45, 35, 25, 10, 5, 2.5];
      console.log('kgToLb');
    }
    // Switched to kg
    else if (unitSelected == "kg") {
      const lbToKg = 0.45359237;
      barbellWeight = 25;
      convertedWeight = this.model.getTotalWeight() * lbToKg;
      weightsSelected = [25, 20, 15, 10, 5, 2.5, 1.25, 0.5, 0.25];
      console.log('lbToKg');

    }
    this.model.setTotalWeight(convertedWeight);
    this.model.setWeightsSelected(weightsSelected);
    this.model.setBarbellWeight(barbellWeight);
    this.model.calculatePlates();
    this.view.renderTargetWeight(convertedWeight);
    this.view.renderBarbellWeight(barbellWeight);
    this.platesData = this.model.getPlates();
    this.renderRows();
  }

  handleMainWeightInput(e) {
    this.model.setTotalWeight(e.target.value);
    this.renderRows(this.platesData);
  }
}

class View {
  constructor() {
    console.log(document.querySelector("#main-weight").value);
    this.targetWeight = document.querySelector("#main-weight");
    this.container = document.querySelector(".plate-count-section");
    this.barbellWeight = document.querySelector("#exampleFormControlInput1");
  }

  renderBarbellWeight(barbellWeight) {
    this.barbellWeight.placeholder = barbellWeight;
  }

  renderTargetWeight(newTargetWeight) {
    this.targetWeight.value = newTargetWeight;
  }

  renderRows(platesData) {
    this.container.innerHTML = ''
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
    console.log(unit);
    console.log(unit[0].textContent);
    controller.toggleUnit(unit);
  });

  $(document).on('click', '#more-settings-btn', function (event) {
    event.preventDefault();
    // your code to handle the button click goes here
  });

  // Target Weight Load
  document.querySelector('#main-weight').addEventListener('input', function (e) {
    controller.handleMainWeightInput(e);
    console.log(e.target.value);
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
    controller.toggleIncluded(index);
  }
});

// Tests
const modelKg = new Model(25, 25);
// const modelKg = new Model(25, 25, [25, 20, 15, 10, 5, 2.5, 1.25, 0.5, 0.25]);
// console.log(modelKg.getPlates());
console.log(modelKg.getBarbellWeight());
console.log(modelKg.getTotalWeight());
modelKg.calculatePlates();

// const modelLb = new Model(135, 45, [45, 35, 25, 10, 5, 2.5]);
// console.log(modelLb.getPlates());
// console.log(modelLb.getBarbellWeight());
// console.log(modelLb.getTotalWeight());
// modelLb.calculatePlates();

const view = new View();
const controller = new Controller(modelKg, view);
controller.renderRows(modelKg.getPlates());