const getSuggestion = async (request, h) => {
  const { userId } = request.query;
  const { db } = request.server.app.firestore;
  const doc = await db.collection('users').doc(userId).get();

  if (!doc.exists) {
    const { boom } = request.server.app;
    return boom.notFound();
  }

  const { weightPoint } = doc.data();

  const SUGGESTIONS = {
    BEGINNER: 'Yuk, tingkatkan lagi kemampuanmu dengan melakukan latihan berulang-ulang. Kamu saat ini sedang berada pada tingkat dua suku kata.',
    INTERMEDIATE: 'Bagus, kamu sudah melewati tingkat dua suku kata. Yuk, tingkatkan lagi kemampuanmu dengan melakukan latihan berulang-ulang. Kamu saat ini sedang berada pada tingkat tiga suku kata.',
    EXPERT: 'Kamu hebat, sekarang kamu sudah melewati tingkat tiga suku kata. Yuk, lanjutkan latihanmu untuk agar kemampuanmu semakin meningkat. Kamu juga bisa loh mencoba fitur kustom soal.',
  };

  const response = {
    data: '',
    message: 'success',
  };

  if (weightPoint < 100) {
    response.data = SUGGESTIONS.BEGINNER;
  } else if (weightPoint < 300) {
    response.data = SUGGESTIONS.INTERMEDIATE;
  } else {
    response.data = SUGGESTIONS.EXPERT;
  }

  return h.response(response).code(200);
};

module.exports = { getSuggestion };
