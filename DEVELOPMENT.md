
## Development Guide
For example, you're going to implements new route called `/items` with issue referenced to "#6 Implements items route":
### Commits, Push & Pull Request:
1. Checkout to related branch `6-implements-items-route`.
3. Implements your `/items` route implementations.
4. Commit your changes incrementally to your current branch `6-implements-items-route`.
5. After you completed all of the current route features, push your changes.
6. Create a new pull request from `6-implements-items-route` branch to `develop` branch in Github.

### Adding routes:
1. Create your route definition file in `.../routes/items.js` (For reference check: `.../routes/words.js`).
2. Include your new route in `.../routes/index.js` file.
3. Create your route handlers file in `.../handlers/items.js`
4. Implements your handlers and export it via `module.exports`

    ```js
    // Example of .../handlers/items.js

    const getItems = async (request, h) => {
      // Implementations
    };

    const createItem = async (request, h) => {
      // Implementations
    };

    module.exports = { getItems, createItem };

    ```
5. Include your route handlers in route definition file `.../routes/items.js`

    ```js
    const { getItems, createItem } = require('../handlers/items');

    const BASE_PATH = '/items';
    const routes = [
      {
        method: 'GET',
        path: BASE_PATH,
        handler: getItems,
      },
      {
        method: 'POST',
        path: BASE_PATH,
        handler: createItem,
      },
    ];

    module.exports = routes;

    ```

### Firebase Firestore Access:
1. Firebase firestore is accessible via `request` parameter in your handler
2. Access the database via `db` object in `request.server.app.firestore`

    ```js
    const getItems = async (request, h) => {
      const { db } = request.server.app.firestore;
      // Implementations
    };
    ```
