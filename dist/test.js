"use strict";
const test = [
    { num: 0, text: 'A' },
    { num: 10, text: 'B' },
    { num: 20, text: 'C' },
    { num: 30, text: 'D' },
];
const test2 = test.filter(num => num.num > 10);
for (const num of test2) {
    num.text = 'AA';
}
console.log(test);
console.log(test2);
