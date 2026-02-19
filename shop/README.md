# Shop Application

This project is a React application built with [Vite](https://vitejs.dev/).

## Getting Started

### Prerequisites

*   Node.js (version 18 or higher recommended)
*   npm

### Installation

1.  Navigate to the `shop` directory:
    ```bash
    cd shop
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode.\
Open [http://localhost:3001](http://localhost:3001) to view it in your browser.

The page will reload when you make changes.

### `npm test`

Launches the unit test runner using Vitest.

### `npm run build`

Builds the app for production to the `dist` folder.

## End-to-End Testing (Playwright)

This project uses [Playwright](https://playwright.dev/) for end-to-end testing.

### Prerequisites

Ensure you have installed the project dependencies:

```bash
npm install
```

If this is your first time running Playwright, verify that the browser binaries are installed:

```bash
npx playwright install
```

### Running Tests

To run the end-to-end tests in headless mode:

```bash
npx playwright test
```

To run tests with the UI interface (time-travel debugging):

```bash
npx playwright test --ui
```

To view the test report:

```bash
npx playwright show-report
```

### Test Configuration

The Playwright configuration is located in `playwright.config.js`. Tests are located in the `tests/` directory.

The tests are configured to automatically start the development server (`npm run dev`) before running.
