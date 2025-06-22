document.addEventListener('DOMContentLoaded', function() {
  const data = [
    { city: 'Atlanta', code: 'ATL' },
    { city: 'Boston', code: 'BOS' },
    { city: 'Chicago', code: 'ORD' },
    { city: 'Dallas/Fort Worth', code: 'DFW' },
    { city: 'Denver', code: 'DEN' },
    { city: 'Los Angeles', code: 'LAX' },
    { city: 'New York (JFK)', code: 'JFK' },
    { city: 'San Francisco', code: 'SFO' },
    { city: 'Seattle', code: 'SEA' },
    { city: 'Washington, D.C. (Dulles)', code: 'IAD' }
  ];

  let current = {};
  let score = 0;
  let total = 0;

  const questionEl = document.getElementById('question');
  const answerEl = document.getElementById('answer');
  const feedbackEl = document.getElementById('feedback');
  const scoreEl = document.getElementById('score');

  function ask() {
    current = data[Math.floor(Math.random() * data.length)];
    questionEl.textContent = `What is the IATA code for ${current.city}?`;
    answerEl.value = '';
    feedbackEl.textContent = '';
    answerEl.focus();
  }

  document.getElementById('submit').addEventListener('click', function() {
    const ans = answerEl.value.trim().toUpperCase();
    total++;
    if (ans === current.code) {
      feedbackEl.textContent = 'Correct!';
      score++;
    } else {
      feedbackEl.textContent = `Incorrect! The code is ${current.code}.`;
    }
    scoreEl.textContent = `Score: ${score}/${total}`;
    ask();
  });

  ask();
});
