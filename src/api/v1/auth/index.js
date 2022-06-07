const verifyAccessToken = async (request, h) => {
  const { 'x-firebase-token': token } = request.headers;
  const { boom, auth } = request.server.app;

  if (!token) {
    return h.unauthenticated(boom.unauthorized('Unauthorized'));
  }

  try {
    const uid = await auth.verifyToken(token);
    return h.authenticated({
      credentials: { uid },
    });
  } catch (error) {
    return h.unauthenticated(boom.unauthorized('Unauthorized'));
  }
};

module.exports = {
  name: 'firebase-auth',
  version: '1.0.0',
  register: (server) => {
    server.auth.scheme('firebase-auth', () => ({
      authenticate: verifyAccessToken,
    }));

    server.auth.strategy('firebase-auth-token', 'firebase-auth');
  },
};
