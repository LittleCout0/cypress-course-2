# Cypress Automated Tests

[**Escola Talking About Testing**](https://udemy.com/user/walmyr) course with content about legacy code maintenance, request interception and API mock response.

Scenarios for the Website [Hacker Stories](https://wlsf82-hacker-stories.web.app/)

##

### Requirements - Windows (10 or +)

Install latest [**NodeJS**](https://nodejs.org/en/download/)

> **_Note_**: Check `Add to PATH` option during the installation

Install latest [**GIT**](https://git-scm.com/download/win) to clone the repository

##

### Clone the Repository and Install Packages

In your terminal (with admin privileges), run this command to clone and install all dependencies

```bash
git clone https://github.com/LittleCout0/playwright-with-cucumber.git && cd playwright-with-cucumber && npm i
```

To run all tests use the command: `npm run test`\
To run a specific scenario or feature, use a tag parameter: `npm run test -- -t @example_tag`\
List of tags

| Feature       | Tag                  |
| ------------- | -------------------- |
| User Login    | @loginFeature        |
| Inventory     | @inventoryFeature    |
| Shopping Cart | @shoppingCartFeature |
| Checkout      | @checkoutFeature     |

Run the command below and the tests report will be available in your browser.

```bash
npm run report && start reports/cucumber_report.html
```

##

#### Git Repository

GitHub: [_Playwright with Cucumber_](https://github.com/LittleCout0/playwright-with-cucumber)

##

#### Libs

- [Playwright](https://playwright.dev/docs/library) - Webdriver Library
- [Cucumber](https://www.npmjs.com/package/@cucumber/cucumber) - BDD Framework
- [Cucumber HTML Reporter](https://www.npmjs.com/package/cucumber-html-reporter) - Report Library
- [Chai](https://www.npmjs.com/package/chai) - Assertion Library
- [Prettier](https://www.npmjs.com/package/prettier) - Code formatter
