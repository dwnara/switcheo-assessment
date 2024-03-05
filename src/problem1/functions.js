/////////////////////////////////////////////////////////////////
// problem statement: find the sum of the first n numbers
// input: n or any integer
// expected output: summation to n
/////////////////////////////////////////////////////////////////

var sum_to_n_a = function(n) {
    // your code here
    // the Gauss sum formula can be used
    let sum = n * (n + 1) / 2;
    return sum;
};

var sum_to_n_b = function(n) {
    // your code here
    let sum = 0;
    // iterate from 1 to and including n
    for (let i = 1; i <= n; i++) {
        // increment the sum for every iteration
        sum += i;
    }
    return sum;
};

var sum_to_n_c = function(n) {
    // your code here
    let sum = 0;
    // loop iterates in a reverse pattern starting with n
    while (n > 0) {
        // increment the sum by the current value of n
        sum += n;
        // decrement n to obtain the previous value
        n--;
    }
    return sum;
};

console.log(sum_to_n_a(11));
console.log(sum_to_n_b(11));
console.log(sum_to_n_c(11));