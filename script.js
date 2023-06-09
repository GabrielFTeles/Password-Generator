const historyList   = document.querySelector('.history-list');
const generateBtn   = document.querySelector('.retry-btn');
const copyBtn       = document.querySelector('.copy-btn');
const clearBtn      = document.querySelector('.clear-history-btn');
const passwordRange = document.querySelector('#password-length');
const resultOutput  = document.querySelector('#result');
const uppercase     = document.querySelector('#uppercase-control');
const lowercase     = document.querySelector('#lowercase-control');
const symbols       = document.querySelector('#symbols-control');
const numbers       = document.querySelector('#numbers-control');
const copyFeedback  = document.querySelector('.copy-sucess');
const passwordLengthElement = document.querySelector('.length-span');

const audio = new Audio('./sound.mp3');

let passwordsHistory = (localStorage.passwordsHistory) ? JSON.parse(localStorage.passwordsHistory) : [];

const savePasswordHistory = (password) => {
  if (password) passwordsHistory.unshift(password);

  if (passwordsHistory.length > 6) passwordsHistory.pop();

  localStorage.passwordsHistory = JSON.stringify(passwordsHistory);
}

const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (min, max) + min);
}

const generatePassword = (length, hasSymbols, hasNumbers, hasUppercase, hasLowercase) => {
  const passwordCharacters = {
    letters: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '1234567890',
    symbols: '-+=_/;.><,:?@!#$%&*',
  }

  const { symbols, numbers, letters } = passwordCharacters;

  const availableCharacters = [
    (hasSymbols ? symbols : ''),
    (hasNumbers ? numbers : ''),
    (hasUppercase ? letters.toUpperCase() : ''),
    (hasLowercase ? letters : ''),
  ].join('');

  if (availableCharacters.length === 0) return '';

  let password = '';

  while (password.length < length) {
    const randomIndex = getRandomNumber(0, (availableCharacters.length - 1));
    password += availableCharacters[randomIndex];
  }

  savePasswordHistory(password);
  updateHistoryList();

  return password;
}

const copyAnimation = () => {
  copyFeedback.classList.add('show');

  setTimeout(() => {
    copyFeedback.classList.remove('show');
  }, 3000);
}

const copyHistoryEvent = (event) => {
  navigator.clipboard.writeText(event.target.previousSibling.textContent);
  copyAnimation();
}

const createHistoryElement = (password, id) => {
  const historyElement = document.createElement('li');
  const passwordText = document.createElement('span');
  const copyIcon = document.createElement('i');

  historyElement.classList.add('history');
  passwordText.classList.add('pass-text');
  copyIcon.classList.add('fa-regular', 'fa-clone');

  historyElement.appendChild(passwordText);
  historyElement.appendChild(copyIcon);
  
  passwordText.textContent = password;
  historyElement.dataset.id = id;

  copyIcon.addEventListener('click', copyHistoryEvent);

  return historyElement;
}

const updateHistoryList = () => {
  historyList.innerHTML = '';

  passwordsHistory.forEach((password, index) => {
    const historyElement = createHistoryElement(password, (index + 1));
    historyList.appendChild(historyElement);
  });
}

const clearHistory = () => {
  if (!confirm('Are you sure you want to clear your history?')) return;

  passwordsHistory = [];
  savePasswordHistory();
}

updateHistoryList();

generateBtn.addEventListener('click', () => {
  result.value = generatePassword(passwordRange.value, symbols.checked, numbers.checked, uppercase.checked, lowercase.checked);

  if (result.value !== '') audio.cloneNode(true).play();
})

copyBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(result.value);
  copyAnimation();
});

passwordRange.addEventListener('input', () => {
  passwordLengthElement.textContent = passwordRange.value;
});

clearBtn.addEventListener('click', () => {
  clearHistory();
  updateHistoryList();
});
