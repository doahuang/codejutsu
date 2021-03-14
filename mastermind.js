const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

(function mastermind() {
  const CHOICE = ['a', 'b', 'c', 'd', 'e', 'f'];
  const MAX = 12;
  const NUM = 4;
  const CODE = genCode();
  let round = 0;

  /* begin */
  console.log("let's play mastermind");
  console.log(`here are the available codes: ${CHOICE}`);
  rl.setPrompt('your guess: ');
  rl.prompt();
  rl.on('line', (input) => {
    round++;
    handle(input);
    rl.prompt();
  }).on('close', () => {
    process.exit(0);
  });
  /* end */

  function genCode() {
    return new Array(4)
      .fill(0)
      .map((_) => CHOICE[Math.floor(Math.random() * CHOICE.length)]);
  }

  function handle(input) {
    const guess = input.slice(0, NUM).split('');
    const exact = getExactMatch(guess);
    const near = getNearMatch(guess);
    message(exact, near);
  }

  function message(exact, near) {
    if (exact === NUM) {
      console.log(`you won!`);
      rl.close();
    }
    if (round >= MAX) {
      console.log(`game over! answer is ${CODE.join('')}`);
      rl.close();
    }
    console.log(`hint: ${exact} A ${near} B`);
  }

  function getExactMatch(guess) {
    return guess.reduce(
      (acc, el, idx) => (el === CODE[idx] ? acc + 1 : acc),
      0
    );
  }

  function getNearMatch(guess) {
    const counts = getCounts(CODE);
    const guessCounts = getCounts(guess);
    let match = 0;
    for (const key in guessCounts) {
      const val = counts[key];
      if (val) {
        match += Math.min(val, guessCounts[key]);
      }
    }
    return match - getExactMatch(guess);
  }

  function getCounts(codes) {
    return codes.reduce((acc, el) => {
      acc[el] = (acc[el] ?? 0) + 1;
      return acc;
    }, {});
  }
})();
