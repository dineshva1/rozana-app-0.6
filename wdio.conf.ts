// wdio.conf.ts (in project root)
import type { Options } from '@wdio/types';
import { androidCapabilities } from './src/config/capabilities';

export const config: Options.Testrunner = {
  runner: "local",
  
  specs: ["./src/tests/**/*.spec.ts"],
  
  exclude: [],
  
  // Define test suites for organized execution
  suites: {
    home: ['./src/tests/flows/home.flow.spec.ts'],
    login: ['./src/tests/flows/login.flow.spec.ts'],
    shopping: ['./src/tests/flows/shopping.flow.spec.ts'],
    categories: ['./src/tests/flows/categories.flow.spec.ts'],
    search: ['./src/tests/flows/search.flow.spec.ts'],
    shoppingwithoutlogin: ['./src/tests/flows/shopping-without-login.flow.spec.ts'],
    shoppingwithaddress: ['./src/tests/flows/shopping-with-address.flow.spec.ts'],
    addresscrud: ['./src/tests/flows/address-crud.spec.ts'],
    complete: ['./src/tests/suites/app-complete.suite.spec.ts'],
    smoke: ['./src/tests/flows/home.flow.spec.ts', './src/tests/flows/login.flow.spec.ts']
  },
  
  maxInstances: 1,
  
  capabilities: [androidCapabilities],
  
  logLevel: "info",
  
  bail: 0,
  
  baseUrl: "",
  
  waitforTimeout: 20000,
  
  connectionRetryTimeout: 120000,
  
  connectionRetryCount: 3,
  
  services: [
    [
      "appium",
      {
        logPath: "./logs",
        command: "appium",
        args: {
          address: "localhost",
          port: 4723,
          relaxedSecurity: true,
          sessionOverride: true,
          debugLogSpacing: true,
          allowInsecure: ["chromedriver_autodownload"],
        },
      },
    ],
  ],
  
  port: 4723,
  
  framework: "mocha",
  
  reporters: [
    "spec",
    [
      "allure",
      {
        outputDir: "allure-results",
        disableWebdriverStepsReporting: false,
        disableWebdriverScreenshotsReporting: false,
        useCucumberStepReporter: false,
        addConsoleLogs: true,
      },
    ],
  ],
  
  mochaOpts: {
    ui: "bdd",
    timeout: 300000,
  },
  
  autoCompileOpts: {
    autoCompile: true,
    tsNodeOpts: {
      transpileOnly: true,
      project: "./tsconfig.json",
    },
  },
  
  beforeSession: function (config, capabilities, specs) {
    console.log("Starting Appium session for Android device...");
  },
  
  before: async function (capabilities, specs) {
    console.log("Test execution started");
  },
  
  afterTest: async function(test, context, { error, result, duration, passed, retries }) {
    if (!passed) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      await browser.saveScreenshot(`./screenshots/failed-${test.title}-${timestamp}.png`);
    }
  },
  
  after: async function (result, capabilities, specs) {
    console.log("Test execution completed");
  },
} as Options.Testrunner;