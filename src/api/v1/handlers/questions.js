const dictionary = {
  a: ['b', 'c', 'd', 'e', 'o', 'p', 'q', 'u', 'v', 'w'],
  b: ['d', 'p', 'q', 'r'],
  c: ['e', 'k', 'u', 'v'],
  d: ['b', 'p', 'q'],
  e: ['a', 'o'],
  f: ['e'],
  g: ['b', 'c', 'd', 'o', 'p', 'q'],
  h: ['m', 'n', 'u', 'v'],
  i: ['j', 'l', 't', 'y'],
  j: ['i', 'l', 'u', 'y'],
  k: ['c', 'x'],
  l: ['i', 'r'],
  m: ['n', 'u'],
  n: ['m', 'u'],
  o: ['a', 'b', 'c', 'd', 'e', 'p', 'q', 'u'],
  p: ['b', 'd', 'q', 'r'],
  q: ['b', 'd', 'g', 'o', 'p'],
  r: ['b', 'd', 'l', 'p', 'q'],
  s: ['x', 'z'],
  t: ['i'],
  u: ['n', 'm', 'v', 'w'],
  v: ['n', 'm', 'u', 'w'],
  w: ['n', 'm', 'u', 'v'],
  x: ['k'],
  y: ['i', 'u', 'v'],
  z: ['s'],
  '-': ['-'],
};

const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = newArray[i];
    newArray[i] = newArray[j];
    newArray[j] = temp;
  }
  return newArray;
};

const makeChoice = (word) => {
  const letters = word.split('');
  for (let i = 0; i < 2; i += 1) {
    const index = Math.floor(Math.random() * word.length);
    const letter = word[index];
    const alphabet = dictionary[letter];
    const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
    letters[index] = randomLetter;
  }
  return letters.join('');
};

const makeScramble = (word) => {
  const letters = word.split('');
  for (let i = 0; i < 2; i += 1) {
    const index = Math.floor(Math.random() * word.length);
    const letter = word[index];
    const alphabet = dictionary[letter];
    const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
    letters.push(randomLetter);
  }
  return shuffleArray(letters);
};

const makeHangman = (word) => {
  const newWord = word.split('');
  const indexes = newWord.map((_, index) => index);
  for (let i = 0; i < word.length / 2; i += 1) {
    const random = Math.floor(Math.random() * indexes.length);
    const index = indexes.splice(random, 1);
    newWord[index] = '_';
  }
  return newWord;
};

const questionsLogger = (questions) => {
  console.log('Multiple Choice: ', questions.filter((question) => question.type === 'multipleChoice').length);
  console.log('Scramble Words: ', questions.filter((question) => question.type === 'scrambleWords').length);
  console.log('Handwriting: ', questions.filter((question) => question.type === 'handwriting').length);

  console.log('Easy: ', questions.filter((question) => question.syllables === 2).length);
  console.log('Medium: ', questions.filter((question) => question.syllables === 3).length);
  console.log('Hard: ', questions.filter((question) => question.syllables >= 4).length);
};

// klo assesment 21 (7 m [2 pilgan - 2 susun - 3 tulis] - 7 sdg -7 slt)

const randomizeWords = (words, qty = 7) => {
  const result = [];
  const wordsCopy = [...words];
  const limit = words.length > qty ? qty : words.length;
  for (let i = 0; i < limit; i += 1) {
    const randomIndex = Math.floor(Math.random() * wordsCopy.length);
    const [randomWord] = wordsCopy.splice(randomIndex, 1);
    result.push(randomWord);
  }
  return result;
};

const makeMultipleChoicesQuestion = (wordObject) => {
  const question = { ...wordObject };
  question.type = 'multipleChoice';
  const ans = [];
  for (let i = 0; i < 3; i += 1) {
    ans.push(makeChoice(wordObject.word));
  }
  const choices = shuffleArray([wordObject.word, ...ans]);
  question.multipleChoice = { choices };
  return question;
};

const makeScrambleWordsQuestion = (wordObject) => {
  const question = { ...wordObject };
  question.type = 'scrambleWords';
  question.scrambleWords = {};
  question.scrambleWords.letters = makeScramble(wordObject.word);
  question.scrambleWords.hintHangman = makeHangman(wordObject.word);
  return question;
};

const makeHandWritingQuestion = (wordObject) => {
  const question = { ...wordObject };
  question.type = 'handwriting';
  question.handWriting = {};
  question.handWriting.hintHangman = makeHangman(wordObject.word);
  return question;
};

const getWords = async (db, level) => {
  let ref = db.collection('words');
  switch (level.toLowerCase()) {
    case 'easy': ref = ref.where('syllables', '==', 2); break;
    case 'medium': ref = ref.where('syllables', '==', 3); break;
    case 'hard': ref = ref.where('syllables', '>=', 4); break;
    default: break;
  }
  const snapshot = await ref.get();
  const words = [];
  snapshot.forEach((doc) => words.push(doc.data()));
  return words;
};

const getSignedHintImgUrlWords = async (words, bucket) => {
  const filesPromises = [];
  const BASE_PATH = 'word-images';
  const newWords = [...words];
  newWords.forEach((word) => {
    const promise = bucket.getFiles({ prefix: `${BASE_PATH}/${word.hintImg}` });
    filesPromises.push(promise);
  });

  const files = await Promise.allSettled(filesPromises);
  const urlsPromises = [];
  files.forEach(async (file) => {
    if (file.status === 'fulfilled') {
      if (file.value[0].length !== 0) {
        urlsPromises.push(file.value[0][0].getSignedUrl({ expires: Date.now() + 360000, action: 'read' }));
      } else {
        urlsPromises.push(Promise.reject());
      }
    } else {
      urlsPromises.push(Promise.reject());
    }
  });

  const urls = await Promise.allSettled(urlsPromises);
  urls.forEach((url, index) => {
    if (url.status === 'fulfilled') {
      const [signedUrl] = url.value;
      newWords[index].hintImg = signedUrl;
    } else {
      newWords[index].hintImg = null;
    }
  });

  return newWords;
};

const getQuestionsAss = async (request, h) => {
  const words = [];
  const { db } = request.server.app.firestore;
  const QTY_PER_LEVEL = 4;
  const { bucket } = request.server.app.storage;

  // easy
  const wordsEasy = await getWords(db, 'easy');
  words.push(...randomizeWords(wordsEasy, QTY_PER_LEVEL));

  // medium
  const wordsMedium = await getWords(db, 'medium');
  words.push(...randomizeWords(wordsMedium, QTY_PER_LEVEL));

  // hard
  const wordsHard = await getWords(db, 'hard');
  words.push(...randomizeWords(wordsHard, QTY_PER_LEVEL));

  let signedWords = null;
  try {
    signedWords = await getSignedHintImgUrlWords(words, bucket);
  } catch (error) {
    signedWords = words.map((word) => ({ ...word, hintImg: null }));
  }
  const questions = signedWords.map((wordObject, index) => {
    if (index % QTY_PER_LEVEL === 0) {
      return makeMultipleChoicesQuestion(wordObject);
    }
    if (index % QTY_PER_LEVEL === 1) {
      return makeScrambleWordsQuestion(wordObject);
    }
    return makeHandWritingQuestion(wordObject);
  });

  // questionsLogger(questions);
  const response = {
    data: questions,
    message: 'success',
  };
  return h.response(response).code(200);
};

// klo auto liat weight point -> nentuin syllables, pokokya 7 soal, 2-2-3

const getQuestionsAuto = async (request, h) => {
  const { db } = request.server.app.firestore;
  const { weightPoint } = request.query;
  const words = [];
  const { bucket } = request.server.app.storage;

  if (weightPoint <= 100) {
    // easy
    const wordsEasy = await getWords(db, 'easy');
    words.push(...randomizeWords(wordsEasy));
  } else if (weightPoint <= 200) {
    // medium
    const wordsMedium = await getWords(db, 'medium');
    words.push(...randomizeWords(wordsMedium));
  } else {
    // hard
    const wordsHard = await getWords(db, 'hard');
    words.push(...randomizeWords(wordsHard));
  }

  let signedWords = null;
  try {
    signedWords = await getSignedHintImgUrlWords(words, bucket);
  } catch (error) {
    signedWords = words.map((word) => ({ ...word, hintImg: null }));
  }
  const questions = signedWords.map((wordObject, index) => {
    if (index < 2) {
      return makeMultipleChoicesQuestion(wordObject);
    }
    if (index < 4) {
      return makeScrambleWordsQuestion(wordObject);
    }
    return makeHandWritingQuestion(wordObject);
  });

  // questionsLogger(questions);

  const response = {
    data: questions,
    message: 'success',
  };
  return h.response(response).code(200);
};

// klo custom nentuin sendiri semua
// centang level yg mana
// total soal, sm randoman level
// query word
// ngerandom yg jenis
// ketemu rentangnya
// dimasukin if else index

const randomNum = (max, qty, len = 1) => {
  let numArray = new Array(len);
  let total = 0;
  do {
    for (let i = 0; i < len; i += 1) {
      numArray[i] = Math.random();
    }
    total = numArray.reduce((acc, val) => acc + val, 0);
    const scale = (qty - len) / total;
    numArray = numArray.map((val) => Math.min(max, Math.round(val * scale) + 1));
    total = numArray.reduce((acc, val) => acc + val, 0);
  } while (total - qty);
  return numArray;
};

const getQuestionsCustom = async (request, h) => {
  const words = [];
  let random = [];
  const { bucket } = request.server.app.storage;

  const { db } = request.server.app.firestore;
  const {
    easy, medium, hard, qty,
  } = request.query;

  let wordsEasy;
  let wordsMedium;
  let wordsHard;

  // Fetch the words
  if (easy) wordsEasy = await getWords(db, 'easy');
  if (medium) wordsMedium = await getWords(db, 'medium');
  if (hard) wordsHard = await getWords(db, 'hard');

  if (easy && medium && hard) {
    random = randomNum(qty / 2, qty, 3);
    const [easyQty, mediumQty, hardQty] = random;
    words.push(...randomizeWords(wordsEasy, easyQty));
    words.push(...randomizeWords(wordsMedium, mediumQty));
    words.push(...randomizeWords(wordsHard, hardQty));
  } else {
    random = randomNum((qty / 2) + 1, qty, 2);
    if (easy && medium) {
      const [easyQty, mediumQty] = random;
      words.push(...randomizeWords(wordsEasy, easyQty));
      words.push(...randomizeWords(wordsMedium, mediumQty));
    } else if (easy && hard) {
      const [easyQty, hardQty] = random;
      words.push(...randomizeWords(wordsEasy, easyQty));
      words.push(...randomizeWords(wordsHard, hardQty));
    } else if (medium && hard) {
      const [mediumQty, hardQty] = random;
      words.push(...randomizeWords(wordsMedium, mediumQty));
      words.push(...randomizeWords(wordsHard, hardQty));
    } else if (easy) {
      words.push(...randomizeWords(wordsEasy, qty));
    } else if (medium) {
      words.push(...randomizeWords(wordsMedium, qty));
    } else if (hard) {
      words.push(...randomizeWords(wordsHard, qty));
    }
  }

  let signedWords = null;
  try {
    signedWords = await getSignedHintImgUrlWords(words, bucket);
  } catch (error) {
    signedWords = words.map((word) => ({ ...word, hintImg: null }));
  }
  // nentuin jenis
  const questions = signedWords.map((wordObject, index) => {
    if (index % 3 === 0) {
      return makeMultipleChoicesQuestion(wordObject);
    }
    if (index % 3 === 1) {
      return makeScrambleWordsQuestion(wordObject);
    }
    return makeHandWritingQuestion(wordObject);
  });

  // questionsLogger(questions);

  const response = {
    data: questions,
    message: 'success',
  };
  return h.response(response).code(200);
};

module.exports = { getQuestionsAss, getQuestionsAuto, getQuestionsCustom };
