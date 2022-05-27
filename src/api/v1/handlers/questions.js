const makeChoice = (word) => {
  let newWord = word;
  for (let i = 0; i < 2; i += 1) {
    const index = word[Math.floor(Math.random() * word.length)];
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
    newWord = newWord.replace(index, randomLetter);
  }
  return newWord;
};

const makeScramble = (word) => {
  const kata = word;
  for (let i = 0; i < 2; i += 1) {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
    kata.push(randomLetter);
  }
  const letters = kata.sort(() => Math.random() - 0.5);
  return letters;
};

const makeHangman = (word) => {
  const newWord = word;
  for (let i = 0; i < word.length / 2 + 1; i += 1) {
    const index = Math.floor(Math.random() * word.length);
    newWord[index] = '_';
  }
  return newWord;
};

// klo assesment 21 (7 m [2 pilgan - 2 susun - 3 tulis] - 7 sdg -7 slt)

const getQuestionsAss = async (request, h) => {
  const questions = [];
  let random = 0;
  const { db } = request.server.app.firestore;

  // easy
  let ref = db.collection('words');
  ref = ref.where('syllables', '<', 4);
  const queryEasy = await ref.get();
  const wordsEasy = [];
  queryEasy.forEach((doc) => {
    const { word, syllables, hintImg } = doc.data();
    const easyWordObject = {
      word,
      syllables,
      hintImg,
    };
    wordsEasy.push(easyWordObject);
  });

  for (let i = 0; i < 7; i += 1) {
    random = Math.floor(Math.random() * wordsEasy.length);
    for (let j = 0; j < questions.length; j += 1) {
      if (questions[j] === wordsEasy[random]) {
        questions.splice(j, 1);
        i -= 1;
      }
    }
    questions.push(wordsEasy[random]);
  }

  // medium
  let refMed = db.collection('words');
  refMed = refMed.where('syllables', '==', 4);
  const queryMedium = await refMed.get();
  const wordsMedium = [];
  queryMedium.forEach((doc) => {
    const { word, syllables, hintImg } = doc.data();
    const mediumWordObject = {
      word,
      syllables,
      hintImg,
    };
    wordsMedium.push(mediumWordObject);
  });

  for (let i = 0; i < 7; i += 1) {
    random = Math.floor(Math.random() * wordsMedium.length);
    for (let j = 0; j < questions.length; j += 1) {
      if (questions[j] === wordsMedium[random]) {
        questions.splice(j, 1);
        i -= 1;
      }
    }
    questions.push(wordsMedium[random]);
  }

  // hard
  let refHard = db.collection('words');
  refHard = refHard.where('syllables', '>', 4);
  const queryHard = await refHard.get();
  const wordsHard = [];
  queryHard.forEach((doc) => {
    const { word, syllables, hintImg } = doc.data();
    const hardWordObject = {
      word,
      syllables,
      hintImg,
    };
    wordsHard.push(hardWordObject);
  });

  for (let i = 0; i < 7; i += 1) {
    random = Math.floor(Math.random() * wordsHard.length);
    for (let j = 0; j < questions.length; j += 1) {
      if (questions[j] === wordsHard[random]) {
        questions.splice(j, 1);
        i -= 1;
      }
    }
    questions.push(wordsHard[random]);
  }

  questions.forEach((question, index) => {
    if (index <= 1 || index === 7 || index === 8 || index === 14 || index === 15) {
      questions[index].type = 'multipleChoice';
      const ans = [];
      for (let i = 0; i < 3; i += 1) {
        ans[i] = makeChoice(question.word);
      }
      questions[index].multipleChoice = {
        choices: [question.word, ans[0], ans[1], ans[2]],
      }; // ngambil 2 huruf asli sisanya dirandom (done)
    }
    if (index === 2 || index === 3 || index === 9
  || index === 10 || index === 16 || index === 17) {
      questions[index].type = 'scrambleWords';
      questions[index].scrambleWords = {
        letters: makeScramble([...question.word.split('')]),
      }; // diacak sm ditambahin huruf (done)
      questions[index].scrambleWords.hintHangman = makeHangman([
        ...question.word.split(''),
      ]); // ada yg dijadiin _, setengah atau lebih (done)
    }
    if (index === 4 || index === 5 || index === 6 || index === 11 || index === 12
      || index === 13 || index === 18 || index === 19 || index === 20) {
      questions[index].type = 'handWriting';
      questions[index].handWriting = {
        hintHangman: makeHangman([...question.word.split('')]),
      };
    }
  });

  const response = {
    data: questions,
    message: 'success',
  };
  return h.response(response).code(200);
};

// klo auto liat weight point -> nentuin syllables, pokokya 7 soal, 2-2-3

const getQuestionsAuto = async (request, h) => {
  const questions = [];
  let random = 0;

  const { db } = request.server.app.firestore;
  const { weightPoint } = request.query;

  let ref = db.collection('words');
  if (weightPoint <= 100) {
    // easy
    ref = ref.where('syllables', '<', 4);
    const snapshot = await ref.get();
    const wordsEasy = [];
    // const x = [];

    snapshot.forEach((doc) => {
      const { word, syllables, hintImg } = doc.data();
      const easyWordObject = {
        word,
        syllables,
        hintImg,
      };
      wordsEasy.push(easyWordObject);
    });

    for (let i = 0; i < 7; i += 1) {
      random = Math.floor(Math.random() * wordsEasy.length);
      for (let j = 0; j < questions.length; j += 1) {
        if (questions[j] === wordsEasy[random]) {
          questions.splice(j, 1);
          i -= 1;
        }
      }
      questions.push(wordsEasy[random]);
    }
  } else if (weightPoint > 100 && weightPoint <= 200) {
    // medium
    ref = ref.where('syllables', '==', 4);
    const snapshot = await ref.get();
    const wordsMedium = [];
    snapshot.forEach((doc) => {
      const { word, syllables, hintImg } = doc.data();
      const mediumWordObject = {
        word,
        syllables,
        hintImg,
      };
      wordsMedium.push(mediumWordObject);
    });

    for (let i = 0; i < 7; i += 1) {
      random = Math.floor(Math.random() * wordsMedium.length);
      for (let j = 0; j < questions.length; j += 1) {
        if (questions[j] === wordsMedium[random]) {
          questions.splice(j, 1);
          i -= 1;
        }
      }
      questions.push(wordsMedium[random]);
    }
  } else {
    // hard
    ref = ref.where('syllables', '>', 4);
    const snapshot = await ref.get();
    const wordsHard = [];
    snapshot.forEach((doc) => {
      const { word, syllables, hintImg } = doc.data();
      const hardWordObject = {
        word,
        syllables,
        hintImg,
      };
      wordsHard.push(hardWordObject);
    });

    for (let i = 0; i < 7; i += 1) {
      random = Math.floor(Math.random() * wordsHard.length);
      for (let j = 0; j < questions.length; j += 1) {
        if (questions[j] === wordsHard[random]) {
          questions.splice(j, 1);
          i -= 1;
        }
      }
      questions.push(wordsHard[random]);
    }
  }

  questions.forEach((question, index) => {
    // console.log(question.word.split(''));
    if (index <= 1) {
      questions[index].type = 'multipleChoice';
      const ans = [];
      for (let i = 0; i < 3; i += 1) {
        ans[i] = makeChoice(question.word);
      }
      questions[index].multipleChoice = {
        choices: [question.word, ans[0], ans[1], ans[2]],
      }; // ngambil 2 huruf asli sisanya dirandom (done)
    }
    if (index >= 2 && index <= 3) {
      questions[index].type = 'scrambleWords';
      questions[index].scrambleWords = {
        letters: makeScramble([...question.word.split('')]),
      }; // diacak sm ditambahin huruf (done)
      questions[index].scrambleWords.hintHangman = makeHangman([
        ...question.word.split(''),
      ]); // ada yg dijadiin _, setengah atau lebih (done)
    }
    if (index >= 4) {
      questions[index].type = 'handWriting';
      questions[index].handWriting = {
        hintHangman: makeHangman([...question.word.split('')]),
      };
    }
  });
  const response = {
    data: questions,
    message: 'success',
  };
  return h.response(response).code(200);
  //   return questions;
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
  const questions = [];
  let random = [];
  // let wordsEasy = [];

  const { db } = request.server.app.firestore;
  const { easy } = request.query;
  const { medium } = request.query;
  const { hard } = request.query;
  const { qty } = request.query;

  // console.log(randomNum(qty / 2, qty));
  if (easy && medium && hard) {
    // console.log('33nya');
    random = randomNum(qty / 2, qty, 3);
    // console.log(random);
    const x = random[0];
    const y = random[1];

    // easy
    // const wordsEasy = getWordsEasy(request, h);
    let ref = db.collection('words');
    ref = ref.where('syllables', '<', 4);
    const queryEasy = await ref.get();
    const wordsEasy = [];
    queryEasy.forEach((doc) => {
      const { word, syllables, hintImg } = doc.data();
      const easyWordObject = {
        word,
        syllables,
        hintImg,
      };
      wordsEasy.push(easyWordObject);
    });

    for (let i = 0; i < x; i += 1) {
      random = Math.floor(Math.random() * wordsEasy.length);
      for (let j = 0; j < questions.length; j += 1) {
        if (questions[j] === wordsEasy[random]) {
          questions.splice(j, 1);
          i -= 1;
        }
      }
      questions.push(wordsEasy[random]);
    }

    // medium
    let refMed = db.collection('words');
    refMed = refMed.where('syllables', '==', 4);
    const queryMedium = await refMed.get();
    const wordsMedium = [];
    queryMedium.forEach((doc) => {
      const { word, syllables, hintImg } = doc.data();
      const mediumWordObject = {
        word,
        syllables,
        hintImg,
      };
      wordsMedium.push(mediumWordObject);
    });

    for (let i = x; i < x + y; i += 1) {
      random = Math.floor(Math.random() * wordsMedium.length);
      for (let j = 0; j < questions.length; j += 1) {
        if (questions[j] === wordsMedium[random]) {
          questions.splice(j, 1);
          i -= 1;
        }
      }
      questions.push(wordsMedium[random]);
    }

    // hard
    let refHard = db.collection('words');
    refHard = refHard.where('syllables', '>', 4);
    const queryHard = await refHard.get();
    const wordsHard = [];
    queryHard.forEach((doc) => {
      const { word, syllables, hintImg } = doc.data();
      const hardWordObject = {
        word,
        syllables,
        hintImg,
      };
      wordsHard.push(hardWordObject);
    });

    for (let i = x + y; i < qty; i += 1) {
      random = Math.floor(Math.random() * wordsHard.length);
      for (let j = 0; j < questions.length; j += 1) {
        if (questions[j] === wordsHard[random]) {
          questions.splice(j, 1);
          i -= 1;
        }
      }
      questions.push(wordsHard[random]);
    }
  } else {
    // eslint-disable-next-line no-lonely-if
    if (easy && medium) {
      // console.log('ez med');
      random = randomNum((qty / 2) + 1, qty, 2);
      // console.log(random);
      const x = random[0];

      // easy
      let ref = db.collection('words');
      ref = ref.where('syllables', '<', 4);
      const queryEasy = await ref.get();
      const wordsEasy = [];
      queryEasy.forEach((doc) => {
        const { word, syllables, hintImg } = doc.data();
        const easyWordObject = {
          word,
          syllables,
          hintImg,
        };
        wordsEasy.push(easyWordObject);
      });

      for (let i = 0; i < x; i += 1) {
        random = Math.floor(Math.random() * wordsEasy.length);
        for (let j = 0; j < questions.length; j += 1) {
          if (questions[j] === wordsEasy[random]) {
            questions.splice(j, 1);
            i -= 1;
          }
        }
        questions.push(wordsEasy[random]);
      }

      // medium
      let refMed = db.collection('words');
      refMed = refMed.where('syllables', '==', 4);
      const queryMedium = await refMed.get();
      const wordsMedium = [];
      queryMedium.forEach((doc) => {
        const { word, syllables, hintImg } = doc.data();
        const mediumWordObject = {
          word,
          syllables,
          hintImg,
        };
        wordsMedium.push(mediumWordObject);
      });

      for (let i = x; i < qty; i += 1) {
        random = Math.floor(Math.random() * wordsMedium.length);
        for (let j = 0; j < questions.length; j += 1) {
          if (questions[j] === wordsMedium[random]) {
            questions.splice(j, 1);
            i -= 1;
          }
        }
        questions.push(wordsMedium[random]);
      }
    } else if (easy && hard) {
      // console.log('ez hard');
      random = randomNum((qty / 2) + 1, qty, 2);
      // console.log(random);
      const x = random[0];

      // easy
      let ref = db.collection('words');
      ref = ref.where('syllables', '<', 4);
      const queryEasy = await ref.get();
      const wordsEasy = [];
      queryEasy.forEach((doc) => {
        const { word, syllables, hintImg } = doc.data();
        const easyWordObject = {
          word,
          syllables,
          hintImg,
        };
        wordsEasy.push(easyWordObject);
      });

      for (let i = 0; i < x; i += 1) {
        random = Math.floor(Math.random() * wordsEasy.length);
        for (let j = 0; j < questions.length; j += 1) {
          if (questions[j] === wordsEasy[random]) {
            questions.splice(j, 1);
            i -= 1;
          }
        }
        questions.push(wordsEasy[random]);
      }

      // hard
      let refHard = db.collection('words');
      refHard = refHard.where('syllables', '>', 4);
      const queryHard = await refHard.get();
      const wordsHard = [];
      queryHard.forEach((doc) => {
        const { word, syllables, hintImg } = doc.data();
        const hardWordObject = {
          word,
          syllables,
          hintImg,
        };
        wordsHard.push(hardWordObject);
      });

      for (let i = x; i < qty; i += 1) {
        random = Math.floor(Math.random() * wordsHard.length);
        for (let j = 0; j < questions.length; j += 1) {
          if (questions[j] === wordsHard[random]) {
            questions.splice(j, 1);
            i -= 1;
          }
        }
        questions.push(wordsHard[random]);
      }
    } else if (medium && hard) {
      // console.log('med hard');
      random = randomNum((qty / 2) + 1, qty, 2);
      // console.log(random);
      const x = random[0];

      // medium
      let refMed = db.collection('words');
      refMed = refMed.where('syllables', '==', 4);
      const queryMedium = await refMed.get();
      const wordsMedium = [];
      queryMedium.forEach((doc) => {
        const { word, syllables, hintImg } = doc.data();
        const mediumWordObject = {
          word,
          syllables,
          hintImg,
        };
        wordsMedium.push(mediumWordObject);
      });

      for (let i = 0; i < x; i += 1) {
        random = Math.floor(Math.random() * wordsMedium.length);
        for (let j = 0; j < questions.length; j += 1) {
          if (questions[j] === wordsMedium[random]) {
            questions.splice(j, 1);
            i -= 1;
          }
        }
        questions.push(wordsMedium[random]);
      }

      // hard
      let refHard = db.collection('words');
      refHard = refHard.where('syllables', '>', 4);
      const queryHard = await refHard.get();
      const wordsHard = [];
      queryHard.forEach((doc) => {
        const { word, syllables, hintImg } = doc.data();
        const hardWordObject = {
          word,
          syllables,
          hintImg,
        };
        wordsHard.push(hardWordObject);
      });

      for (let i = x; i < qty; i += 1) {
        random = Math.floor(Math.random() * wordsHard.length);
        for (let j = 0; j < questions.length; j += 1) {
          if (questions[j] === wordsHard[random]) {
            questions.splice(j, 1);
            i -= 1;
          }
        }
        questions.push(wordsHard[random]);
      }
    } else {
      // eslint-disable-next-line no-lonely-if
      if (easy) {
        // console.log('ez');
        // easy
        let ref = db.collection('words');
        ref = ref.where('syllables', '<', 4);
        const queryEasy = await ref.get();
        const wordsEasy = [];
        queryEasy.forEach((doc) => {
          const { word, syllables, hintImg } = doc.data();
          const easyWordObject = {
            word,
            syllables,
            hintImg,
          };
          wordsEasy.push(easyWordObject);
        });

        for (let i = 0; i < qty; i += 1) {
          random = Math.floor(Math.random() * wordsEasy.length);
          for (let j = 0; j < questions.length; j += 1) {
            if (questions[j] === wordsEasy[random]) {
              questions.splice(j, 1);
              i -= 1;
            }
          }
          questions.push(wordsEasy[random]);
        }
      } else if (medium) {
        // console.log('med');
        // medium
        let refMed = db.collection('words');
        refMed = refMed.where('syllables', '==', 4);
        const queryMedium = await refMed.get();
        const wordsMedium = [];
        queryMedium.forEach((doc) => {
          const { word, syllables, hintImg } = doc.data();
          const mediumWordObject = {
            word,
            syllables,
            hintImg,
          };
          wordsMedium.push(mediumWordObject);
        });

        for (let i = 0; i < qty; i += 1) {
          random = Math.floor(Math.random() * wordsMedium.length);
          for (let j = 0; j < questions.length; j += 1) {
            if (questions[j] === wordsMedium[random]) {
              questions.splice(j, 1);
              i -= 1;
            }
          }
          questions.push(wordsMedium[random]);
        }
      } else {
        // console.log('hard');
        // hard
        let refHard = db.collection('words');
        refHard = refHard.where('syllables', '>', 4);
        const queryHard = await refHard.get();
        const wordsHard = [];
        queryHard.forEach((doc) => {
          const { word, syllables, hintImg } = doc.data();
          const hardWordObject = {
            word,
            syllables,
            hintImg,
          };
          wordsHard.push(hardWordObject);
        });

        for (let i = 0; i < qty; i += 1) {
          random = Math.floor(Math.random() * wordsHard.length);
          for (let j = 0; j < questions.length; j += 1) {
            if (questions[j] === wordsHard[random]) {
              questions.splice(j, 1);
              i -= 1;
            }
          }
          questions.push(wordsHard[random]);
        }
      }
    }
  }

  // nentuin jenis
  questions.forEach((question, index) => {
    if (index % 2 !== 0 && index % 3 !== 0) {
      questions[index].type = 'multipleChoice';
      const ans = [];
      for (let i = 0; i < 3; i += 1) {
        ans[i] = makeChoice(question.word);
      }
      questions[index].multipleChoice = {
        choices: [question.word, ans[0], ans[1], ans[2]],
      }; // ngambil 2 huruf asli sisanya dirandom (done)
    }
    if (index % 2 === 0 && index % 3 !== 0) {
      questions[index].type = 'scrambleWords';
      questions[index].scrambleWords = {
        letters: makeScramble([...question.word.split('')]),
      }; // diacak sm ditambahin huruf (done)
      questions[index].scrambleWords.hintHangman = makeHangman([
        ...question.word.split(''),
      ]); // ada yg dijadiin _, setengah atau lebih (done)
    }
    if (index % 3 === 0) {
      questions[index].type = 'handWriting';
      questions[index].handWriting = {
        hintHangman: makeHangman([...question.word.split('')]),
      };
    }
  });

  const response = {
    data: questions,
    message: 'success',
  };
  return h.response(response).code(200);
};

module.exports = { getQuestionsAss, getQuestionsAuto, getQuestionsCustom };
