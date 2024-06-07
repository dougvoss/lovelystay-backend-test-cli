# CLI GitHub User Info

This command-line application allows you to obtain user information from GitHub and store it in a PostgreSQL database.

## Configuration

1. Clone the repository.
2. Create a `.env` file with the PostgreSQL database URL and github api url: (based on `.env.example`)

```
DATABASE_URL="postgres://<user>:<password>@localhost:5432/mydatabase"
GITHUB_API_URL="https://api.github.com"
```

3. Install dependencies:

```
npm install
```

4. Compile TypeScript:

```
npm run build
```

5. Run the database migrations:

```
npm run migrate
```

## Call methods

Show command help:

```
node dist/main.js --help
```

Add a GitHub user:

```
node dist/main.js --addUser <username>
```

List users:

```
node dist/main.js --listUsers
```

List users filtered by location or language:

```
node dist/main.js --listUsers <filter>
```

## Tests

Run tests:

```
npm run test
```

Run tests and generate coverage report:

```
npm run test:coverage
```

## Licence

This project is licensed under the MIT License.

## Author

Douglas Voss
