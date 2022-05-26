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
    BEGINNER: 'Ini rekomendasi untuk kelas pemula',
    INTERMEDIATE: 'Ini rekomendasi untuk kelas menengah',
    EXPERT: 'Ini rekomendasi untuk kelas ahli',
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
