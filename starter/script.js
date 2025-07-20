'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__value">${mov}€</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
console.log(containerMovements.innerHTML);

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumIn.textContent = `${incomes}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const intrest = acc.movements
    .filter(mov => mov > 0)
    .map(deposite => (deposite * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = `${intrest}€`;
};

//Update UI
const updateUI = function (acc) {
  //Display Movements
  displayMovements(acc.movements);
  //Display balance
  calcDisplayBalance(acc);
  //Display Summary
  calcDisplaySummary(acc);
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUsernames(accounts);
console.log(accounts);

let currentAccount;
//Event handler
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    //Clear input field
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginUsername.blur();
    inputLoginPin.blur();

    //Update UI
    updateUI(currentAccount);
  }
});

///////////////////////////////
//Money transfer Functionality
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const recieverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    recieverAcc &&
    currentAccount.balance >= amount &&
    recieverAcc?.username !== currentAccount.username
  ) {
    //Doing transfer
    currentAccount.movements.push(-amount);
    recieverAcc.movements.push(amount);

    //Update UI
    updateUI(currentAccount);
  }
});

////////////////////////////////////
//Btn Loan Functionality
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount / 10)) {
    //Pushing loan to Movements
    currentAccount.movements.push(amount);

    //Updating the UI
    updateUI(currentAccount);
  }

  inputLoanAmount.value = '';
});

////////////////////////////////////
//Btn close functionality

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);

    //Delete account
    accounts.splice(index, 1);

    //Hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

// let arr = ['a', 'b', 'c', 'd', 'e'];

//Slice() //Doesn't mutate
// console.log(arr.slice(2));
// console.log(arr.slice(2, 4));
// console.log(arr.slice(-1));
// console.log(arr.slice(-3));
// console.log(arr.slice(1, -2));
// console.log(arr.slice());
// console.log([...arr]);

// //Splice() //mutate
// console.log(arr.splice(-1));
// arr.splice(1, 2);
// console.log(arr);

// //reverse //mutate
// const arr2 = ['j', 'i', 'h', 'g', 'f'];
// console.log(arr2.reverse());
// console.log(arr2.slice(1));

// //concat //Doesn't mutate
// const letters = arr.concat(arr2);
// console.log(letters);
// console.log([...arr, ...arr2]);

// //join //Doesn't mutate
// console.log(letters.join(' - '));

//New at()Method
// console.log(arr.at(0));
// console.log(arr.at(-1));
// console.log(arr.at(-2));

/////////////////////////////////////////
///////////////forEach()/////////////////
/////////////////////////////////////////

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// for (const [i, mov] of movements.entries()) {
//   if (mov > 0) {
//     console.log(`Movement no ${i + 1}: You desposited ${mov}rs`);
//   } else {
//     console.log(`Movement no ${i + 1}: You withdraw ${Math.abs(mov)}rs`);
//   }
// }

// console.log('-----fOREACH-----');
// movements.forEach(function (mov, i, arr) {
//   if (mov > 0) {
//     console.log(`Movement no ${i + 1}: You desposited ${mov}rs`);
//   } else {
//     console.log(`Movement no ${i + 1}: You withdraw ${Math.abs(mov)}rs`);
//   }
// });

//For Each for maps and sets

//maps
// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// currencies.forEach(function (value, key, map) {
//   console.log(`${key}: ${value}`);
// });

// //sets
// const currencyUnique = new Set(['pkr', 'inr', 'afr', 'irr', 'pkr', 'afr']);
// currencyUnique.forEach(function (value, key, map) {
//   console.log(`${key}: ${value}`);
// });

// console.log(currencyUnique);

///////////////////////////////////////
// Coading Challenge #1

/* 
Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, and stored the data into an array (one array for each). For now, they are just interested in knowing whether a dog is an adult or a puppy. A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.

Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things:

1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! So create a shallow copy of Julia's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶")
4. Run the function for both test datasets

HINT: Use tools from all lectures in this section so far 😉

TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

// const dogsJulia = [3, 5, 2, 12, 7];
// const dogsKate = [4, 1, 15, 8, 3];

// const newDogsJulia = dogsJulia.slice(1, -2);

// const allDogs = newDogsJulia.concat(dogsKate);
// console.log(allDogs);

// allDogs.forEach(function (chk, i, arr) {
//   if (chk > 5) {
//     console.log(`Dog no ${i + 1} is an adult, and is ${chk} years old`);
//   } else {
//     console.log(`Dog no ${i + 1} is still a puppy🐶`);
//   }
// });

/////////////////////////////////////////
/////////////////Maps()//////////////////
/////////////////////////////////////////

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const euroToPkr = 327.51;

// const movementPkr = movements.map(mov => mov * euroToPkr);

// console.log(movementPkr);

// const movementDescription = movements.map((mov, i) => {
//   return `Movement no ${i + 1}: You ${
//     mov > 0 ? 'deposite' : 'withdraw'
//   } ${mov}rs`;
// });

// console.log(movementDescription);

/////////////////////////////////
///////////filter()//////////////
/////////////////////////////////

// const deposites = movements.filter(function (mov) {
//   return mov > 0;
// });
// console.log(deposites);

// const withdrawals = movements.filter(mov => mov < 0);
// console.log(withdrawals);

/////////////////////////////////
///////////reduce()//////////////
/////////////////////////////////

//Accumulator Like a snowball
// const balance = movements.reduce((acc, cur) => acc + cur, 0);
// console.log(balance);

// //Maximum value
// const max = movements.reduce((acc, mov) => {
//   if (acc > mov) return acc;
//   else return mov;
// }, movements[0]);

// console.log(max);

///////////////////////////////////////
// Coding Challenge #2

/* 
Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human ages and calculate the average age of the dogs in their study.

Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following things in order:

1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)
4. Run the function for both test datasets

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

// const calcAverageHumanAge = function (ages) {
//   const humanAges = ages.map(age => (age <= 2 ? 2 * age : 16 + age * 4));
//   console.log(humanAges);

//   const adultDogs = humanAges.filter(age => age >= 18);
//   console.log(humanAges);
//   console.log(adultDogs);

//   const average =
//     adultDogs.reduce((acc, age) => acc + age, 0) / adultDogs.length;
//   return average;
// };
// const avg1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
// const avg2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);

// console.log(avg1, avg2);

/////////////////////////////////
//////pipeline chain method//////
/////////////////////////////////

// const euroToUsd = 1.1;

// const totalDepositeToUsd = movements
//   .filter(mov => mov > 0)
//   .map((mov, i, arr) => {
//     console.log(arr);
//     mov * euroToUsd;
//   })
//   .reduce((acc, mov) => acc + mov, 0);

// console.log(totalDepositeToUsd);

///////////////////////////////////////
// Coding Challenge #3

/* 
Rewrite the 'calcAverageHumanAge' function from the previous challenge, but this time as an arrow function, and using chaining!

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

// const calcAverageHumanAge = ages =>
//   ages
//     .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
//     .filter(age => age >= 18)
//     .reduce((acc, age, i, arr) => acc + age / arr.length, 0);

// const avg1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
// const avg2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);

// console.log(avg1, avg2);

/////////////////////////////////
//////////////Find()/////////////
/////////////////////////////////

// const firstWithdrawal = movements.find(mov => mov < 0);
// console.log(movements);
// console.log(firstWithdrawal);

// console.log(accounts);

// const account = accounts.find(acc => acc.owner === 'Jessica Davis');
// console.log(account);

/////////////////////////////////
////////Some and Every()/////////
/////////////////////////////////

// console.log(movements);
// console.log(movements.includes(-130));

// //Some()
// const ifGreaterPresent = movements.some(mov => mov > 3220);
// console.log(ifGreaterPresent);

// //Every()
// console.log(movements.every(mov => mov > 0));
// console.log(account4.movements.every(mov => mov > 0));

// //separate callBack()
// const deposit = mov => mov > 0;
// console.log(movements.some(deposit));
// console.log(movements.filter(deposit));
// console.log(movements.every(deposit));

// /////////////////////////////////
// ///////Flat and Flatmap()////////
// /////////////////////////////////

// const arr = [[1, 2, 3], [3, 4, 5], 6, 7];
// console.log(arr.flat());

// const deepArr = [[1, [2, 3]], [[3, 4], 5], 6, 7];
// console.log(deepArr.flat(4));

// const accountMovements = accounts.map(acc => acc.movements);
// console.log(accountMovements);

// const allMovements = accountMovements.flat();
// console.log(allMovements);

// const overallBalance = allMovements.reduce((acc, mov) => acc + mov, 0);
// console.log(overallBalance);

// const overallBalanceChaining = accounts
//   .map(acc => acc.movements)
//   .flat()
//   .reduce((acc, mov) => acc + mov, 0);

// console.log(overallBalanceChaining);

// //FlatMap

// const overallBalanceChaining2 = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((acc, mov) => acc + mov, 0);

// console.log(overallBalanceChaining);

///////////////////////////////////////
// Coding Challenge #4

/*
This time, Julia and Kate are studying the activity levels of different dog breeds.
 
YOUR TASKS:
1. Store the the average weight of a "Husky" in a variable "huskyWeight"
2. Find the name of the only breed that likes both "running" and "fetch" ("dogBothActivities" variable)
3. Create an array "allActivities" of all the activities of all the dog breeds
4. Create an array "uniqueActivities" that contains only the unique activities (no activity repetitions). HINT: Use a technique with a special data structure that we studied a few sections ago.
5. Many dog breeds like to swim. What other activities do these dogs like? Store all the OTHER activities these breeds like to do, in a unique array called "swimmingAdjacent".
6. Do all the breeds have an average weight of 10kg or more? Log to the console whether "true" or "false".
7. Are there any breeds that are "active"? "Active" means that the dog has 3 or more activities. Log to the console whether "true" or "false".
 
BONUS: What's the average weight of the heaviest breed that likes to fetch? HINT: Use the "Math.max" method along with the ... operator.
 
TEST DATA:
*/

// const breeds = [
//   {
//     breed: 'German Shepherd',
//     averageWeight: 32,
//     activities: ['fetch', 'swimming'],
//   },
//   {
//     breed: 'Dalmatian',
//     averageWeight: 24,
//     activities: ['running', 'fetch', 'agility'],
//   },
//   {
//     breed: 'Labrador',
//     averageWeight: 28,
//     activities: ['swimming', 'fetch'],
//   },
//   {
//     breed: 'Beagle',
//     averageWeight: 12,
//     activities: ['digging', 'fetch'],
//   },
//   {
//     breed: 'Husky',
//     averageWeight: 26,
//     activities: ['running', 'agility', 'swimming'],
//   },
//   {
//     breed: 'Bulldog',
//     averageWeight: 36,
//     activities: ['sleeping'],
//   },
//   {
//     breed: 'Poodle',
//     averageWeight: 18,
//     activities: ['agility', 'fetch'],
//   },
// ];

// // 1.
// const huskeyWeight = breeds.find(
//   breed => breed.breed === 'Husky'
// ).averageWeight;
// console.log(huskeyWeight);

// // 2.
// const dogBothActivities = breeds.find(
//   breed =>
//     breed.activities.includes('running') && breed.activities.includes('fetch')
// );
// console.log(dogBothActivities);

// // 3.
// const allActivities = breeds.flatMap(breed => breed.activities);
// console.log(allActivities);

// // 4.
// const uniqueActivities = [...new Set(allActivities)];
// console.log(uniqueActivities);

// // 5.
// const swimmingAdjacent = [
//   ...new Set(
//     breeds
//       .filter(breed => breed.activities.includes('swimming'))
//       .flatMap(breed => breed.activities)
//       .filter(activity => activity !== 'swimming')
//   ),
// ];
// console.log(swimmingAdjacent);

// // 6.
// console.log(breeds.every(breed => breed.averageWeight > 10));

// // 7.
// console.log(breeds.some(breed => breed.activities.length >= 3));

// // Bonus.
// const fetchWeights = breeds
//   .filter(breed => breed.activities.includes('fetch'))
//   .map(breed => breed.averageWeight);
// const highestFetch = Math.max(...fetchWeights);
// console.log(highestFetch);
// console.log(fetchWeights);

/////////////////////////////////
/////////sorting arrays//////////
/////////////////////////////////

// const owners = [
//   'syed muhammad ahmed bukhari',
//   'zeeshan',
//   'Laiba zaib',
//   'muqadas bukhari',
// ];

// console.log(owners.sort());

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// console.log(movements.sort());

// // Accending order.
// // return > 0 : A , B ==>(Keep order)
// // return < 0 : B , A ==>(Switch order)
// // movements.sort((a, b) => {
// //   if (a > b) return 1;
// //   if (a < b) return -1;
// // });

// movements.sort((a, b) => a - b);
// console.log(movements);

// // Decending order.
// // movements.sort((a, b) => {
// //   if (a > b) return -1;
// //   if (a < b) return 1;
// // });

// movements.sort((a, b) => b - a);
// console.log(movements);

/////////////////////////////////
////////Array Grouping()/////////
/////////////////////////////////

// const groupMovements = Object.groupBy(movements, movement =>
//   movement > 0 ? 'deposite' : 'withdrawal'
// );

// console.log(groupMovements);

// const groupedByActivity = Object.groupBy(accounts, account => {
//   const movementCount = account.movements.length;

//   if (movementCount >= 8) return 'Very Active';
//   if (movementCount >= 4) return 'Active';
//   if (movementCount >= 8) return 'Moderate';
//   else return 'inactive';
// });

// console.log(groupedByActivity);

/////////////////////////////////
/////Creating and filling()//////
/////////////////////////////////
// const x = new Array(7);
// console.log(x);
// x.fill(3);
// console.log(x);

// const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
// arr.fill(1, 3, 8);
// console.log(arr);

// // Array .form
// const y = Array.from({ length: 19 }, () => 1);
// console.log(y);

// const z = Array.from({ length: 8 }, (_, i) => i + 1);
// console.log(z);

// const diceRolls = Array.from(
//   { length: 100 },
//   (_, i) => (i = Math.round(Math.random() * 5) + 1)
// );
// console.log(diceRolls);

// labelBalance.addEventListener('click', function () {
//   const movementsUI = Array.from(
//     document
//       .querySelectorAll('.movements__value')
//       .map(el => Number(el.textContent.replace('€'), ''))
//   );
//   console.log(movementsUI);
// });

/////////////////////////////////
//Alternatives to rev, sorted()//
/////////////////////////////////

///////////////////////////////////////
// Non Destructive reverse() methods

// console.log(movements);
// // const reversedMovements = movements.slice().reverse();
// const reversedMovements = movements.toReversed();
// console.log(reversedMovements);

// // toSorted() => sort &&& toSliced() => slice
// const mevementsNew = movements.with(1, 2000);
// console.log(mevementsNew);

///////////////////////////////////////
// Array Methods Practice

// 1.
const bankDepositeSum = accounts
  .flatMap(acc => acc.movements)
  .filter(dep => dep > 0)
  .reduce((sum, deposite) => sum + deposite, 0);

console.log(bankDepositeSum);

// 2.
const numDeposite1000 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, cur) => (cur >= 1000 ? ++acc : acc), 0);

console.log(numDeposite1000);

// ++ incrementaion (prefixed)
let a = 10;
console.log(a++);
console.log(++a);
console.log(a + 1);

// 3.
const { deposites, withdrawals } = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sum, cur) => {
      // cur > 0 ? (sum.deposites += cur) : (sum.withdrawals += cur);
      sum[cur > 0 ? 'deposites' : 'withdrawals'] += cur;
      return sum;
    },
    { deposites: 0, withdrawals: 0 }
  );

console.log(deposites, withdrawals);
