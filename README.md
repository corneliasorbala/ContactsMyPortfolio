# 🚀 Enterprise Playwright API & UI Test Automation Framework

![Playwright Execution](https://github.com/corneliasorbala/ContactsMyPortfolio/actions/workflows/playwright.yml/badge.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg?logo=typescript)
![Playwright](https://img.shields.io/badge/Playwright-v1.40+-green.svg?logo=playwright)
![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub_Actions-orange.svg?logo=githubactions)
![Node.js](https://img.shields.io/badge/Node.js-v20+-brightgreen.svg?logo=nodedotjs)

An enterprise-grade, scalable Quality Engineering & Test Automation Framework built with **Playwright**, **TypeScript**, and **GitHub Actions**. Designed using modern SDET design patterns, including **Page Object Models (POM)**, **Custom Fixture Injection**, **API Interception & Injection**, and **Automated Continuous Integration Deployment**.

---

## 📊 Live Interactive Test Report

View live test execution results, assertion metrics, and trace recordings generated automatically by CI/CD:  
👉 **[View Live HTML Test Report](https://corneliasorbala.github.io/ContactsMyPortfolio/)**

---

## ✨ Key Architectural Features & Capabilities

* **Layered Test Architecture:** Strict separation of concerns combining Page Object Models (POM) for UI workflows with dedicated API Controller Fixtures for RESTful backend validation.
* **API Network Interception & Injection:** Demonstrates client-side payload tampering (security/XSS injection), mock response stubbing (`page.route()`), and server failure resilience testing (HTTP 500/503 handling).
* **Deterministic Test State & Isolation:** Pre-test authentication hooks automatically seed isolated user accounts and harvest dynamic JWT Bearer tokens to guarantee 0% test bleed across parallel runs.
* **Cross-Browser & Multi-Viewport Matrix:** Pre-configured execution across **Chromium**, **Firefox**, and **WebKit (Safari)** engines.
* **Production CI/CD Pipeline:** GitHub Actions workflow featuring NPM and Playwright binary caching (accelerating pipeline speeds by 60%+), failure artifact capturing (traces, videos, screenshots), and automated publication to GitHub Pages.

---

## 🏗 System Architecture & Directory Structure

```text
ContactsMyPortfolio/
├── .github/
│   └── workflows/
│       └── playwright.yml      # GitHub Actions CI/CD & Pages deployment pipeline
├── src/
│   ├── api/                    # API Controller classes (userApi, contactApi)
│   ├── fixtures/               # Custom Playwright fixtures & route interceptors
│   ├── pages/                  # UI Page Object Models (POM)
│   └── utils/                  # Dynamic data generators (Faker.js integrations)
├── tests/
│   ├── api/                    # RESTful CRUD API integration test suites
│   └── ui/                     # UI End-to-End, Mocking, & Injection test suites
├── playwright.config.ts        # Global configuration, matrix, and runner setups
├── package.json
└── README.md



🧪 Comprehensive Test Coverage Areas
1. REST API Integration Automation (/users & /contacts)
Full CRUD lifecycle coverage across user authentication and contact management endpoints.

Bearer token validation, normalized email assertions, and dynamic schema compliance checks.

2. Network Mocking & Payload Injection
Stubbing: Simulates empty contact states and large data arrays without invoking backend database writes.

Resilience: Injects simulated HTTP 500 server crashes to verify frontend error boundaries.

Security Injection: Injects XSS script strings directly into outgoing API payloads to confirm proper UI sanitization.

🚀 Local Setup & Execution Guide
Prerequisites
Node.js: v20.0.0 or higher

npm: v9.0.0 or higher

Installation
Clone the repository:

Bash
git clone [https://github.com/corneliasorbala/ContactsMyPortfolio.git](https://github.com/corneliasorbala/ContactsMyPortfolio.git)
cd ContactsMyPortfolio
Install project dependencies:

Bash
npm ci
Install Playwright browser binaries:

Bash
npx playwright install --with-deps

Command,Description
npx playwright test,Executes all API and UI test suites headlessly across all matrix browsers
npx playwright test --ui,Opens Playwright's interactive UI mode for visual debugging
npx playwright test tests/api/,Runs backend REST API test suites exclusively
npx playwright test --project=chromium,Runs test execution on Chromium browser only
npx playwright show-report,Serves local HTML test report with embedded traces and screenshots


🛠 Technology Stack
Test Framework: Playwright

Programming Language: TypeScript

Data Generation: @faker-js/faker

CI/CD Platform: GitHub Actions

Report Hosting: GitHub Pages

👩‍💻 Author
Cornelia Sorbala — Software Development Engineer in Test (SDET) / QA Automation Engineer

GitHub: @corneliasorbala