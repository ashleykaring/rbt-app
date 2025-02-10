# RBT (Rose, Bud, Thorn) App

## Information

### Accessing

[To be filled in: How to access the deployed application]

### Our Team

**-Class:** CSC-309, Software Engineering II

**-Team:** Scrubbles

**-Members:** Ashley, Brady, Giselle, Parker, Xio

### About

A mobile-first progressive web application for creating, saving, and sharing Rose, Bud, Thorn reflections.

![App Logo](react-frontend/public/RBDLogoRounded.png)

#### Pages

-   Home: See all your past entries, centered around a calendar view
-   Search: Look up past entries and organize them by tag
-   New Entry: Submit your entry for the today or edit it if things change
-   Groups: Join or create a group to share your entries with others
-   Settings: Manage your account and groups

### Branding

[To be filled in: Logo, color scheme, and typography]

### Full Documentation

Product specification available at:
https://cpslo-my.sharepoint.com/:b:/g/personal/pjones15_calpoly_edu/EW_O0ofp7f9Cpm9mq8KCwU8BgxeyUlGi8LrXj0IQUS_bwA?e=JT287A

## Development

### Getting Started

Our project utilizes a mono-repo strategy with separate directories for front and backend.

1. Clone the repository
2. Create `.env` file in `express-backend` folder with:

    ```
    MONGODB_URI=mongodb+srv://XXXXX:XXXXX@cluster0.q1r5h.mongodb.net/rbt_users_data
    JWT_SECRET=XXXXX
    ```

3. Install all dependencies (both frontend and backend):
    ```bash
    npm install
    ```
4. Start both servers:
    ```bash
    npm start
    ```

### Testing

To run the test suite:

```bash
npm test
```

#### Database Operations

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
```

#### Mock-Based Tests

[To be filled in: other tests]

### Tech Stack

#### Core Technologies

-   Frontend: React.js
-   Backend: Node.js/Express.js
-   Database: MongoDB
-   Authentication: JWT

#### Development Tools

-   Concurrently
-   Nodemon

#### Code Quality

-   ESLint
-   Prettier with config file

#### Continuous Integration

[To be filled in: CI/CD pipeline information]

#### Deployment

[To be filled in: Production deployment information]
