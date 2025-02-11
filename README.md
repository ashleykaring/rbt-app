# RBT (Rose, Bud, Thorn) App

# Getting Started

## Product Spec

Viewable at the following link:
https://cpslo-my.sharepoint.com/:b:/g/personal/pjones15_calpoly_edu/EW_O0ofp7f9Cpm9mq8KCwU8BgxeyUlGi8LrXj0IQUS_bwA?e=JT287A

## Setup

1. Clone the repository
2. Create `.env` file in `express-backend` folder with:

    ```
    MONGODB_URI=mongodb+srv://XXXXX:XXXXX@cluster0.q1r5h.mongodb.net/rbt_users_data
    JWT_SECRET=XXXXX
    ```

    Note: For grading purposes, you can use our original values provided separately.

3. Install all dependencies (both frontend and backend):
    ```bash
    npm install
    ```
4. Start both servers:
    ```bash
    npm start
    ```

## Quick Start Guide

After setup:

1. Create an account
2. Join a group with code: 3L1A3G (test group for grading)
3. Share your RBT for the day!

# Testing

Run the test suite:

```bash
npm test
```

Latest Model test coverage report (December 4, 2023, 05:54:38):

```
File             | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-----------------|---------|----------|---------|---------|-------------------
All files        |    100  |    100   |   100   |   100   |
 group-services.js|    100  |    100   |   100   |   100   |
 groups.js       |    100  |    100   |   100   |   100   |
 user-services.js|    100  |    100   |   100   |   100   |
 user.js         |    100  |    100   |   100   |   100   |
-----------------|---------|----------|---------|---------|-------------------

Total Coverage Summary:
- Statements : 84/84 (100%)
- Branches   : 4/4 (100%)
- Functions  : 17/17 (100%)
- Lines      : 84/84 (100%)
```

The coverage report shows 100% test coverage across all files involving the model system. Coverage includes all database operations, schema validations, and error handling.

# Code Style

## ES-LINT

In VSCode please enable the ESLint for Javascript extension, the IDE will automatically flag these on npm start and as warnings

## Prettier

In VSCode please enable the Prettier extension. Also, in settings turn on Prettier as Default Formatter & enable "Format on Save" & "Format on Paste". This will enforce the prettier using the config whenever you save code

# About

A mobile-first application for creating and sharing Rose, Bud, Thorn reflections within groups.

## Tech Stack

-   Frontend: React.js
-   Backend: Node.js/Express.js
-   Database: MongoDB
-   Authentication: JWT
-   Development Tools: Concurrently, Nodemon

# Figma Prototype

https://www.figma.com/proto/k6hVGwym15fjauvJcAr6bc/RBT?node-id=1-17&t=WMD2GRyX0BEHsMKm-1

# Testing on Phone

Run setup:
npm run ngrok:setup

Run connection:
ngrok http 3000
