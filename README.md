# Weight-To-Plate-v2
This is a simple weightlifting plate calculator that allows users to calculate the weights needed on each side of a barbell based on the total weight desired.

Live Website: https://delacruzralph.github.io/Weight-To-Plate-v2/

Note: This is v2 of Weight To Plate. v1 can be found here: [v1 repository](https://github.com/delacruzralph/Plate-Weight-Calculator). Changelist will be included at the bottom of this README.md

## Technologies Used

- HTML
- CSS
- Javascript
- Bootstrap
- jQuery
- Figma

## Introduction
This project is a weight plate calculator that allows users to input a target weight they want to lift and displays the plates required to achieve that weight. Users can toggle which plates they want to include, and the calculator will update accordingly.

## How to Use
To use the weight plate calculator, simply enter your target weight in the input field. The calculator will display the number of plates required for each weight, and the total weight of the barbell and plates. You can toggle which plates you want to include by clicking on the checkbox next to the plate weight.

You can also switch between pounds and kilograms by clicking on the unit selector at the top of the page. Note that the weight input will be converted to the selected unit automatically.

## Code Overview
The weight plate calculator is built using JavaScript and consists of three classes: Plate, Model, and Controller.

The Plate class represents a single weight plate and contains information about the weight, the number of plates per side, and whether the plate is included in the calculation.

The Model class is responsible for generating the plate data and performing calculations. It stores information about the total weight, barbell weight, and the weights of the available plates. The Model class also contains methods for updating the plate data based on user input.

The Controller class is responsible for updating the view based on changes to the plate data. It listens for user input events and calls the appropriate methods in the Model class to update the plate data. It then calls the appropriate methods in the view to render the updated data.

## Conclusion
The weight plate calculator is a simple but useful tool for weightlifters who want to calculate the number of plates required for a target weight. It is built using JavaScript and consists of three classes: Plate, Model, and Controller. The code is well-organized and easy to read, making it easy to understand how the calculator works and make modifications if necessary.
