//variables:

const submitBtn = document.querySelector("#submit");
const inputText = document.querySelector("#problem");
const clearBtn = document.querySelector('#reset')
submitBtn.value = "FIND X";
clearBtn.value = 'Clear'
let inputString;
let equation1;
let equation2;
let answer;

//functions:

function checkErrors(equation) {}

function checkNotOperator(string) {
  return string !== "+" && string !== "-" && string !== "*";
}

function convertX(equation, i) {
  if (equation === 2) {
    if (equation2[i] === "-x") {
      equation2[i] = "-1x";
    }
    if (equation2[i] === "x") {
      equation2[i] = "1x";
    }
  } else {
    if (equation1[i] === "-x") {
      equation1[i] = "-1x";
    }
    if (equation1[i] === "x") {
      equation1[i] = "1x";
    }
  }
}

function moveRight() {
  //moving all numbers to the right of equal sign:
  for (let i = 0; i < equation1.length; i++) {
    //converting x to 1x or -1x
    convertX(1, i);

    //checking if array element is a number and not on operator or variable
    if (Number.isFinite(Number(equation1[i]))) {
      //if it is not the first element in the equation then we can assume that there is an operator behind
      //it for example x + 2 and the operator behind it is + and we can use this to check if the operator should be negative or positive
      if (i !== 0) {
        //if on the left side the operator is positive then on the right side it should be negative and vice versa:
        if (equation1[i - 1] === "+") {
          operator = "-";
        } else {
          operator = "+";
        }
        pushed = equation1[i];
        deleteAmount = [i - 1, 2];
        iChange = "i-2";
      } else {
        //if the it is the first element in the equation then we have to check if the number itself is positve or negative instead of looking at the operator
        if (equation1[i] > 0) {
          operator = "-";
        } else {
          operator = "+";
        }
        //we push the operator and equation and remove the number and the next operator since that's not in equation1 anymore
        pushed = equation1[i];
        deleteAmount = [i, 2];
        iChange = "i--";
      }
      if (equation2.length === 0) {
        //if the length of equation 2 is 0 then we can't push the operator and number seperately since it can't be - 2 it has to be -2
        if (operator === "+") {
          pushed = equation1[i];
        } else {
          pushed = operator + equation1[i];
        }
        deleteAmount = [i - 1, 2];
        iChange = "i-2";
      }
      if (equation2.length !== 0) {
        equation2.push(operator);
      }
      equation2.push(pushed);
      equation1.splice(deleteAmount[0], deleteAmount[1]);
      if (iChange === "i-2") {
        i = i - 2;
      } else {
        i--;
      }
    }
  }
}

function moveLeft() {
  //moving all variables to the left side
  for (let i = 0; i < equation2.length; i++) {
    if (equation2[i].includes("x")) {
      //making variable have 1 with it so we can do operations with variables later
      convertX(2, i);
      //we don't want to move the variable to the left side and remove the operator also because if we remove x in x - 7 then we will be left with 7 but we need to be left with -7 so we need to attach the operator to the number
      console.log(equation2[i], equation2);
      if (i !== equation2.length - 1) {
        if (!equation2[i + 2].includes("x") && equation2[i + 1] === "-") {
          equation2[i + 2] = equation2[i + 1] + equation2[i + 2];
          console.log(equation2[i + 2]);
        }
      }
      //if x is not the first element then we assume that behind it there's an operator for example: 7 - x
      if (i !== 0) {
        if (equation2[i - 1] === "+") {
          operator = "-";
        } else {
          operator = "+";
        }
        pushed = equation2[i];
        iChange = "i-2";
        deleteAmount = [i - 1, 2];
      } else {
        //if the variable is the first element then we have to check if it is the number itself is positive or negative because we can't look at operators
        if (Number.parseInt(equation2[i]) > 0) {
          operator = "-";
          pushed = equation2[i];
        } else {
          operator = "+";
          pushed =
            Math.abs(Number.parseInt(equation2[i])) +
            equation2[i][equation2[i].indexOf("x")];
        }
        iChange = "i--";
        deleteAmount = [i, 2];
      }
      equation1.push(operator);
      equation1.push(pushed);
      equation2.splice(deleteAmount[0], deleteAmount[1]);
      if (iChange === "i-2") {
        i = i - 2;
      } else {
        i--;
      }
    }
  }
}

function calculateSides() {
  //calculate right side
  for (let i = 0; i < equation2.length; i++) {
    let result;
    i = 0;
    if (equation2.length === 1) break;
    //if operator is + we add the two numbers together. If operator is - we subtract the two numbers
    if (equation2[i + 1] === "+") result = +equation2[i] + +equation2[i + 2];
    if (equation2[i + 1] === "-") result = equation2[i] - equation2[i + 2];

    equation2.splice(i, 2);
    equation2[i] = String(result);
  }
  console.log(equation1, equation2);

  //calculate left side
  for (let i = 0; i < equation1.length; i++) {
    i = 0;
    if (equation1.length === 1) {
      break;
    }

    console.log(equation1, equation2);

    let part1 = [
      Number.parseInt(equation1[0]),
      equation1[i][equation1[i].length - 1],
    ];

    let part2 = [
      Number.parseInt(equation1[i + 2]),
      equation1[i + 2][equation1[i + 2].length - 1],
    ];
    console.log(part1, part2);

    if (equation1[i + 1] === "+") result = +part1[0] + +part2[0];
    if (equation1[i + 1] === "-") result = part1[0] - part2[0];
    equation1.splice(i, 2);
    equation1[i] = result + "x";
  }

  divideX();
  console.log(equation1);
}

function divideX() {
  //testing for a wrong equation for example x + 2 = x + 2 to avoid errors
  if (equation1[0] === "0x") {
    answer = "There are no solutions or any number can be a solution";
  } else {
    answer = `x = ${equation2[0] / Number.parseInt(equation1[0])}`;
  }
  console.log(answer);
  inputText.value = answer;
}

function arrangeEquation() {
  console.log(equation1, equation2);
  let operator;
  let pushed;
  let iChange;
  let deleteAmount;

  //move variables from right to left side
  moveLeft();

  //move numbers from left to right side
  moveRight();

  console.log(equation1, equation2);
  calculateSides();
}

function splitString(inputString) {
  //splitting up the string
  const equation = inputString.split("=");
  equation1 = equation[0].split(" ");
  equation2 = equation[1].split(" ");

  //removing empty strings in splitted arrays
  equation1 = equation1.filter((letter) => letter !== "");
  equation2 = equation2.filter((letter) => letter !== "");

  arrangeEquation();
}

//event handlers:

submitBtn.addEventListener("click", function (e) {
  e.preventDefault();
  inputString = inputText.value;
  splitString(inputString);
});
