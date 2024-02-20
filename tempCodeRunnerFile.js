"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2023-12-31T17:01:17.194Z",
    "2024-01-28T23:36:17.929Z",
    "2024-02-03T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2];

// BANKIST APP
/*
// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];*/

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");
//extra for logout btn
const btnLogout = document.querySelector(".logout-btn");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  console.log(daysPassed);

  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  /*const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;*/
  return new Intl.DateTimeFormat(locale).format(date);
};

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  // first container is being empty then putting history
  containerMovements.innerHTML = "";
  // below portion will work for sorting
  const mov = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  // based on the movement evaluating either deposit or withdrawal and showing
  // on the history box changing the system by html.
  mov.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);
    // formating currency depend on local iso
    const formattedMov = formatCur(mov, acc.locale, acc.currency);

    const html = `
      <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${formattedMov}</div> 
        </div>
    `;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

//calculating individual's total balance after movements depend on user name
const calcDisplayBalance = function (account) {
  account.balance = account.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = formatCur(
    account.balance,
    account.locale,
    account.currency
  );
};

// displaying all deposite, withdrawal and interest in total
const calcDisplaySummary = function (acc) {
  //deposit
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);
  //withdrawal
  const outBalance = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(
    Math.abs(outBalance),
    acc.locale,
    acc.currency
  );
  //interest
  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int) => int >= 1)
    .reduce((acc, interest) => acc + interest, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};
// creating username depend upon full name.
const creatUserNames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((word) => word[0])
      .join("");
  });
};

creatUserNames(accounts);
const updateUI = function (acc) {
  //Display movements
  displayMovements(acc);
  //Display balance
  calcDisplayBalance(acc);
  //Display summary
  calcDisplaySummary(acc);
};

// logout timer setting
const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    //In each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;
    // when 0 seconds, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = "Log in to get started";
      containerApp.style.opacity = 0;
    }
    // decrease 1s each call of call back fun
    time--;
  };
  // set time to 5 min
  let time = 300;

  //call the timer every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};
//Event handler on login button
let currentAccount, timer;

// below for fake login after finish work remove it
/*currentAccount = account1;
updateUI(currentAccount);
containerApp.style.opacity = 100;*/

//above here delete after work done

btnLogin.addEventListener("click", function (e) {
  // after clicking a button by default it reload a page on form
  //so to prevent this we can use below function
  e.preventDefault();

  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);
  //?. is called optonal chaining operator
  if (currentAccount?.pin === +inputLoginPin.value) {
    //Display UI and welcome message
    labelWelcome.textContent = `Welcome back...👏! ${
      currentAccount.owner.split(" ")[0]
    }`;
    //below for zoom effect after login
    labelWelcome.classList.add("zoom-in-out");

    // Remove the class after the animation completes
    setTimeout(() => {
      labelWelcome.classList.remove("zoom-in-out");
    }, 5000);
    // if credentials ar e correct make UI visible for user
    containerApp.style.opacity = 100;

    //Current Date & Time
    const now = new Date();
    const options = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "long",
      year: "numeric",
      //weekday: "short",
    };
    const locale = navigator.language;
    console.log(locale);
    // for current date and time depending on ISO code table
    labelDate.textContent = new Intl.DateTimeFormat(locale, options).format(
      now
    );
    /*const day = `${now.getDate()}`.padStart(2, 0);
    const month = `${now.getMonth() + 1}`.padStart(2, 0);
    const year = now.getFullYear();
    const hour = `${now.getHours()}`.padStart(2, 0);
    const min = `${now.getMinutes()}`.padStart(2, 0);

    labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;*/
    //Clear the input fields
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();
    // if ther previously any timer running first remove that.
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
    // update UI
    updateUI(currentAccount);
    //showing logout button after login
    btnLogout.style.display = "block";
  } else {
    // if i want the change the color then ask cgpt
    alert("Invalid Username or Password!");
  }
});

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value; //Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = "";
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    //deduct or adding amount after transfer happened successfully
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    //add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());
    //Update UI
    updateUI(currentAccount);
    alert("blanced transfered");
    // reset timer
    clearInterval(timer);
    timer = startLogOutTimer();
  } else {
    alert("could not found the user");
    // reset timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

//for requesting loan
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value); //insted of <-  +inputLoanAmount.value; insted of ->//Number(inputLoanAmount.value);
  if (amount <= 0) {
    alert("Please enter amount!");
    // reset timer
    clearInterval(timer);
    timer = startLogOutTimer();
  } else if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    setTimeout(function () {
      //add to movement
      currentAccount.movements.push(amount);
      //add loan date
      currentAccount.movementsDates.push(new Date().toISOString());
      //Update UI
      updateUI(currentAccount);
      alert("Amount added to the balance!");
      // reset timer
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 3000);
  } else {
    // reset timer
    clearInterval(timer);
    timer = startLogOutTimer();

    const rep = prompt(`
      You don't have the requirment to get this amount, 
      Would you like to know the requirments (Y or N)`);
    if (rep === "y" || rep === "Y") {
      alert(`
        At least one deposit of your account should be 
        greater or equal to requesting amount, thanks`);
    }
  }
  // clear input field
  inputLoanAmount.value = "";
});

btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
    // + making string into number
    //above is same like: Number(inputClosePin.value) === currentAccount.pin
  ) {
    // finding the exact index of acc need to delete from the accounts arr based on condition
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);
    //Hide UI
    containerApp.style.opacity = 0;
    labelWelcome.textContent = "We are sorry to leave you😥";
  } else {
    alert("enter username and password correctly");
  }

  inputCloseUsername.value = inputClosePin.value = "";
});

// if click for sotr then soted will be true if not then false or default
let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

btnLogout.addEventListener("click", function () {
  clearInterval(timer);
  labelWelcome.textContent = "You have logged out";
  containerApp.style.opacity = 0;
  btnLogout.style.display = "none";

  setTimeout(function () {
    window.location.href = "index.html"; // Replace "login.html" with your actual login page URL
  }, 2000);
  /*btnLogout.style.display = "none";
  setTimeout(function () {
    labelWelcome.textContent = "Log in to get started";
  }, 2000);*/
});
/*
labelBalance.addEventListener("click", function () {
  [...document.querySelectorAll(".movements__row")].forEach(function (row, i) {
    if (i % 2 === 0) {
      row.style.backgroundColor = "lightblue";
    }
    if (i % 3 === 0) {
      row.style.backgroundColor = "gray";
    }
  });
});
*/

/*const tonow = new Date();
console.log(tonow);

console.log(new Date("Sun Feb 04 2024 03:51:36"));

console.log(new Date("February 4, 2024"));
*/

/*setTimeout(
  // any argument after the time will be the argument of fun
  //and after 3000ms it will accept the argument
  (ing1, ing2) => console.log(`Here is your pizza with ${ing1} and ${ing2} 🍕`),
  3000,
  "olives",
  "spinach"
);
console.log("Waiting...");*/
/*
setInterval(function () {
  const now = new Date();

  let hour = now.getHours();
  const min = now.getMinutes();
  const sec = now.getSeconds();
  const ampm = hour >= 12 ? "PM" : "AM";
  // hour % 12 means value should be less than 12(short circuite or)
  hour = hour % 12 || 12;

  console.log(`${hour}:${min}:${sec} ${ampm}`);
}, 1000);
*/
