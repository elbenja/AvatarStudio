const $ = id => document.getElementById(id);
let round;
let timer;
let retry;

async function request(path, data) {
  const response = await fetch(path, data === undefined ? {} : {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error);
  return result;
}

function sampleMove(turns) {
  const exit = { kind: 'concede', text: 'You stumped me!', ruledOut: [] };
  if (turns.length === 0) return { kind: 'question', text: 'Where would you usually find it?', ruledOut: [] };
  if (!/kitchen/i.test(turns[0].answer)) return exit;
  if (turns.length === 1) return { kind: 'question', text: 'Is it something you eat?', ruledOut: [] };
  if (turns[1].answer.toLowerCase() !== 'no') return exit;
  const ruledOut = ['Food'];
  if (turns.length === 2) return { kind: 'question', text: 'Is its main job to boil water?', ruledOut };
  if (turns.length === 3 && turns[2].answer.toLowerCase() === 'yes') {
    return { kind: 'guess', text: 'A kettle', ruledOut };
  }
  return { ...exit, ruledOut };
}

function renderTimer() {
  const remaining = Math.max(0, 120 - Math.floor((Date.now() - round.started) / 1000));
  $('timer').textContent = `${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, '0')}`;
  $('timer-label').textContent = remaining ? 'Time goal' : 'Time goal reached';
}

function setFeedback(message = '', action) {
  $('feedback').textContent = message;
  retry = action;
  $('retry').hidden = !action;
}

function line(role, text) {
  const item = document.createElement('li');
  const label = document.createElement('small');
  label.textContent = role;
  const message = document.createElement('p');
  message.textContent = text;
  item.append(label, message);
  return item;
}

function render() {
  const { current, history, done, sample, pending } = round;
  const messages = history.flatMap(({ move, answer }) => [
    line('Telepa', move.kind === 'guess' ? `My guess: ${move.text}` : move.text),
    line('You', answer),
  ]);
  if (current) messages.push(line('Telepa', current.kind === 'guess' ? `My guess: ${current.text}` : current.text));
  $('messages').replaceChildren(...messages);
  $('messages').scrollTop = $('messages').scrollHeight;
  $('result').textContent = done ?? '';
  const exclusions = current?.ruledOut ?? [];
  $('clues').replaceChildren(...exclusions.map(text => {
    const item = document.createElement('li');
    item.textContent = text;
    return item;
  }));
  $('empty-clues').hidden = exclusions.length > 0;
  const questions = history.filter(({ move }) => move.kind === 'question').length + Number(current?.kind === 'question');
  $('count').textContent = `Question ${questions} of 12`;
  $('correct').hidden = history.length === 0;
  $('correct').disabled = pending;
  $('end').textContent = done ? 'Play again' : 'End round';

  const canAnswer = current && !done;
  $('answer-controls').hidden = !canAnswer;
  $('answer-form').hidden = current?.kind !== 'question';
  $('answer').placeholder = sample && history.length === 0 ? 'Type “in the kitchen”…' : 'Type a short clue…';
  $('answer').disabled = pending;
  $('answer-form').querySelector('button').disabled = pending;
  const labels = current?.kind === 'guess'
    ? ['That’s right', 'Wrong guess']
    : questions === 1 ? ['Not sure'] : ['Yes', 'No', 'Not sure'];
  $('quick').replaceChildren(...labels.map(label => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = label;
    button.disabled = pending;
    button.addEventListener('click', () => submit(label));
    return button;
  }));
}

async function advance(answer) {
  const active = round;
  const history = answer ? [...active.history, { move: active.current, answer }] : active.history;
  setFeedback('Telepa is thinking…');
  active.pending = true;
  render();
  try {
    const turns = history.map(({ move, answer }) => ({ kind: move.kind, text: move.text, answer }));
    const move = active.sample ? sampleMove(turns) : await request('/api/turn', { category: active.category, turns });
    if (round !== active) return;
    active.current = move;
    active.history = history;
    $('answer').value = '';
    setFeedback();
    if (!active.started) {
      active.started = Date.now();
      renderTimer();
      timer = setInterval(renderTimer, 1000);
    }
    if (move.kind === 'concede') finish('Round over');
  } catch (error) {
    if (round === active) setFeedback(error.message || 'Something went wrong.', () => advance(answer));
  } finally {
    if (round === active) {
      active.pending = false;
      render();
    }
  }
}

function start(category, sample) {
  round = { category, sample, history: [], current: null };
  $('setup').hidden = true;
  $('game').hidden = false;
  $('category').textContent = sample ? 'Scripted sample · Think of a kettle' : category === 'object' ? 'An object' : 'A person';
  $('timer').textContent = '2:00';
  $('timer-label').textContent = 'Time goal';
  $('round-title').focus();
  advance();
}

function finish(message) {
  round.done = message;
  clearInterval(timer);
  setFeedback();
  render();
}

function submit(answer) {
  if (!round?.current || round.pending || round.done || !answer.trim()) return;
  if (round.current.kind === 'guess') {
    if (answer === 'That’s right') return finish('Telepa guessed it!');
    if (round.history.some(({ move }) => move.kind === 'guess')) return finish('You stumped Telepa!');
  }
  advance(answer.trim());
}

$('answer-form').addEventListener('submit', event => {
  event.preventDefault();
  submit($('answer').value);
});
$('correct').addEventListener('click', () => {
  const { move, answer } = round.history.pop();
  round.current = move;
  if (round.done) {
    clearInterval(timer);
    timer = setInterval(renderTimer, 1000);
    renderTimer();
  }
  round.done = undefined;
  setFeedback();
  render();
  if (move.kind === 'question') {
    $('answer').value = answer;
    $('answer').focus();
    $('answer').select();
  }
});
$('end').addEventListener('click', () => {
  clearInterval(timer);
  round = undefined;
  setFeedback();
  $('answer').value = '';
  $('game').hidden = true;
  $('setup').hidden = false;
  ($('categories').hidden ? $('sample') : $('categories').querySelector('button')).focus();
});
$('retry').addEventListener('click', () => retry?.());
$('sample').addEventListener('click', () => start('object', true));
$('categories').addEventListener('click', event => {
  const category = event.target.closest('button')?.dataset.category;
  if (category) start(category, false);
});

try {
  const { live } = await request('/api/status');
  $('categories').hidden = !live;
  $('status').textContent = live ? 'Live chat' : 'Sample mode';
  if (live) $('notice').append(' Live clues are sent to OpenAI.');
} catch {
  $('status').textContent = 'Sample mode';
}
