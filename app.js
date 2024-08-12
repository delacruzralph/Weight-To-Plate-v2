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
    this.weights = [25, 20, 15, 10, 5, 2.5, 1.25, 0.5, 0.25];
    this.plates = this.generatePlates(this.weights);
  }

  roundToNumNearestD(num, d) {
    return Math.round(num / d) * d;
  }

  getPlates() {
    return this.plates;
  }

  setDefaultBarbellWeight() {
    this.barbellWeight = this.weights[0];
    console.log(this.barbellWeight);
    this.plates = this.generatePlates(this.weights);
    this.calculatePlates();
  }

  getBarbellWeight() {
    return this.barbellWeight;
  }

  getTotalWeight() {
    return this.totalWeight;
  }

  generatePlates(weights) {
    return weights.map(num => {
      return new Plate(num, 0, true);
    });
  }

  setWeightsSelected(weights) {
    this.weights = weights;
    this.plates = this.generatePlates(weights);
  }

  setTotalWeight(weight) {
    this.totalWeight = weight;
    this.calculatePlates();
  }

  setBarbellWeight(weight) {
    this.barbellWeight = weight;
    this.calculatePlates();
  }

  calculatePlates() {
    let remainingWeight = this.totalWeight - this.barbellWeight;
    this.plates.forEach(plate => {
      plate['perSide'] = plate['included'] == true ? Math.floor(remainingWeight / plate['weight'] / 2) : 0;
      remainingWeight -= plate['weight'] * plate['perSide'] * 2;
    })
  }

  increaseRowPerSide(index) {
    this.plates[index]['perSide'] += 1;
    this.calcNewTargetWeight();
  }

  decreaseRowPerSide(index) {
    if (this.plates[index]['perSide'] > 0) {
      this.plates[index]['perSide'] -= 1;
      this.calcNewTargetWeight();
    }
  }

  toggleIncluded(index) {
    this.plates[index]['included'] = !this.plates[index]['included'];
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
    this.defaultBarbellWeight = this.model.get
  }

  renderRows() {
    this.view.renderRows(this.platesData);
  }

  renderPlates() {
    this.view.renderPlates(this.platesData.filter(plate => plate.perSide > 0));
  }

  decreaseRowPerSide(index) {
    this.model.decreaseRowPerSide(index);
    this.renderRows();
    this.renderPlates();
    this.view.renderTargetWeight(this.model.getTotalWeight());
  }

  increaseRowPerSide(index) {
    this.model.increaseRowPerSide(index);
    this.renderRows();
    this.renderPlates();
    this.view.renderTargetWeight(this.model.getTotalWeight());
  }

  toggleIncluded(index) {
    this.model.toggleIncluded(index);
    this.model.calculatePlates();
    this.renderRows();
    this.renderPlates();
  }

  roundToNearest(num, d) {
    return Math.round(num / d) * d;
  }

  toggleUnit(unit) {
    const textbox = document.getElementById("main-weight");
    const unitSelected = unit[0].textContent;
    let convertedWeight;
    let weightsSelected;
    let barbellWeight;
    let roundToNearest;

    // Switched to lb 
    if (unitSelected == "lb") {
      const kgToLb = 2.20462262185;
      barbellWeight = 45;
      convertedWeight = this.model.getTotalWeight() * kgToLb;
      weightsSelected = [45, 35, 25, 10, 5, 2.5];
    }
    // Switched to kg
    else if (unitSelected == "kg") {
      const lbToKg = 0.45359237;
      barbellWeight = 20;
      convertedWeight = this.model.getTotalWeight() * lbToKg;
      weightsSelected = [25, 20, 15, 10, 5, 2.5, 1.25, 0.5, 0.25];
    }
    roundToNearest = weightsSelected[weightsSelected.length - 1];

    this.model.setTotalWeight(convertedWeight);
    this.model.setWeightsSelected(weightsSelected);
    this.model.setBarbellWeight(barbellWeight);
    this.model.calculatePlates();
    this.view.renderTargetPlaceholder(unitSelected);
    this.view.renderTargetWeight(this.model.roundToNumNearestD(convertedWeight, roundToNearest));
    this.view.renderBarbellWeight(barbellWeight);
    this.platesData = this.model.getPlates();
    this.renderRows();
    this.renderPlates();
  }

  handleMainWeightInput(e) {
    if (e.target.value >= this.model.getBarbellWeight()) {
      this.model.setTotalWeight(e.target.value);
      this.renderRows();
      this.renderPlates();
    }
  }

  handleBarbellInput(e) {

    console.log(e.target.value);
    if (e.target.value >= 0) {
      this.model.setBarbellWeight(e.target.value);
    }
    else if (e.target.value == "" || e.target.value < 0) {
      this.model.setDefaultBarbellWeight();
      this.model.getPlates();
    }
    this.platesData = this.model.getPlates();
    this.renderRows();
    this.renderPlates();
  }


}

class View {
  constructor() {
    this.targetWeightUnit = document.querySelector("#unit");
    this.targetWeight = document.querySelector("#main-weight")
    this.container = document.querySelector(".plate-count-section");
    this.barbellWeight = document.querySelector("#exampleFormControlInput1");
    this.platesGraphicSection = document.querySelector(".plates-graphic-section");
    this.windowWidth = window.innerWidth;

  }

  renderTargetPlaceholder(unit) {
    this.targetWeightUnit.innerText = unit;
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
    row.classList.add('row', 'mb-4', 'text-center', 'd-flex', 'align-items-top');
    row.dataset.index = index;

    const valueColumn = document.createElement('span');
    valueColumn.classList.add('col-3');
    valueColumn.textContent = plateData['weight'];
    row.appendChild(valueColumn);

    const inputColumn = document.createElement('div');
    inputColumn.classList.add('col-6');

    const minusButton = document.createElement('button');
    minusButton.classList.add('btn', 'btn-outline-secondary', 'font-weight-bold', 'circle-btn');
    minusButton.textContent = '-';
    inputColumn.appendChild(minusButton);

    const valueSpan = document.createElement('span');
    valueSpan.textContent = plateData['perSide'];
    valueSpan.classList.add('mx-3', 'medium-bg-color', 'text-light', 'p-2', 'rounded', 'font-weight-bold');
    inputColumn.appendChild(valueSpan);

    const plusButton = document.createElement('button');
    plusButton.classList.add('btn', 'btn-outline-secondary', 'font-weight-bold', 'circle-btn');
    plusButton.textContent = '+';
    inputColumn.appendChild(plusButton);

    row.appendChild(inputColumn);

    const checkboxColumn = document.createElement('div');
    checkboxColumn.classList.add('col-3');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('form-control', 'form-check-input');
    checkbox.checked = plateData['included'];
    checkboxColumn.appendChild(checkbox);

    row.appendChild(checkboxColumn);

    this.container.appendChild(row);
  }

  renderPlates(platesData) {
    this.platesGraphicSection.innerHTML = "";
    const barbell = document.createElement('div');
    barbell.classList.add('barbell');
    this.platesGraphicSection.appendChild(barbell);
    let totalPlates = 0;
    platesData.forEach(plate => {
      for (let i = 0; i < plate['perSide']; i++) {
        const plateToAdd = document.createElement('div');
        plateToAdd.classList.add('plate');
        plateToAdd.style.left = (this.windowWidth / 2.25) + (totalPlates * 18) + "px";
        plateToAdd.style.height = Math.sqrt(plate['weight']) * 25 + 10 + "px";
        this.platesGraphicSection.appendChild(plateToAdd);
        totalPlates += 1;
      }
    })
  }
}


// jQuery for toggle button for unit (kg/lb);
$(function () {
  $(document).on('click', '.btn-toggle', function (event) {
    event.preventDefault();
    $(this).find('.btn').toggleClass('active');

    if ($(this).find('.btn-secondary').length > 0) {
      $(this).find('.btn').toggleClass('btn-secondary');
    }

    $(this).find('.btn').toggleClass('btn-default');

    let unit = $(this).find('.active');
    controller.toggleUnit(unit);
  });

  $(document).on('click', '#more-settings-btn', function (event) {
    event.preventDefault();
  });

  // Target Weight Load
  document.querySelector('#main-weight').addEventListener('input', function (e) {
    e.preventDefault();
    controller.handleMainWeightInput(e);
  });

  document.querySelector('#exampleFormControlInput1').addEventListener('input', function (e) {
    e.preventDefault();
    controller.handleBarbellInput(e);
  });

});

// attach a single event listener to the parent container using event delegation
document.getElementById('plate-count-section').addEventListener('click', (event) => {
  const target = event.target;
  const index = target.closest('.row').dataset.index;
  if (target.tagName === 'BUTTON') {
    if (target.textContent === '-') {
      controller.decreaseRowPerSide(index);
    } else if (target.textContent === '+') {
      controller.increaseRowPerSide(index);
    }
  } else if (target.tagName === 'INPUT') {
    controller.toggleIncluded(index);
  }
});

// Initialize Calculator
const modelKg = new Model(25, 25);
modelKg.calculatePlates();
const view = new View();
const controller = new Controller(modelKg, view);
controller.renderRows(modelKg.getPlates());
