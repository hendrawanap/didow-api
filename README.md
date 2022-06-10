# Didow API
Dyslexia: dIfferent DOesn’t mean Wrong.
![Logo](https://raw.githubusercontent.com/Arifwira/Didow/master/DidowLogo.png)

## About The Project
Didow app is our final project for Bangkit 2022 program graduation requirement. Didow helps kids with dyslexia to learn to read and write in a fun way. With Didow, we will try to improve the learning progress and provides affordable assessment and treatment for children with dyslexia.

Here's why:

- There are still rarely free applications that develop treatments for dyslexic children in Indonesia.
- Of the 50 million school children in Indonesia, 5 million of them suffer from this disorder.

## Things That Provided By The API:
- Generate exercise's questions based on selected type
- Analyze assessment result
- Adjusting exercise's difficulty
- Save dan analyze exercise history
- Give recommendation based on user's progress
- As a middleware between the mobile app and the machine learning part

## OpenAPI Documentation Page
You can go to [this link](https://documenter.getpostman.com/view/16016438/Uz5KjtYP) to view the API documentation.

## Prerequisites Tools:
- Git
- Code Editor (e.g., Visual Studio Code)
- Firebase Service Account Key
- Node.js v14.18.1 or later

## Other Required Services:
- [Didow ML API](https://github.com/hendrawanap/didow-ml-api) (required for `/handwritings` endpoints)

## Local Installation:
1. Clone [this repository](https://github.com/hendrawanap/didow-api.git) to your local machine
2. Open the root directory in your code editor
3. Install node dependencies

    ```
    npm install
    ```

4. Prepare your `Firebase Service Account Key`
5. Copy `.env.example` file to `.env`

    ```
    cp .env.example .env
    ```
6. Configure your `.env` file based on your prepared `Firebase Service Account Key` & add your `Didow ML API URL` to the `.env` file
7. Run your application by running this command:

    ```
    npm run dev
    ```

## Folder Structure
```
src
 |-- app.js                    (Application starting point)
 |-- api
     |-- v1                    (API versioning)
        |--- auth              (API auth related files)
        |--- config            (Server configuration files)
        |--- handlers          (API routes handlers)
        |--- routes            (API routes definitions)
        |--- services          (External services)
        |--- validations       (Request validations)
        |--- server.js         (Server initializer)
  |-- temp                     (Temporary files)
 ...
 ...
 ...
```

# Notes
This repository is a part of our Didow Project

Other related repositories:
- [Didow Android App](https://github.com/Arifwira/Didow)
- [Didow ML](https://github.com/MRifqiFz/DidowML)
- [Didow ML API](https://github.com/hendrawanap/didow-ml-api)