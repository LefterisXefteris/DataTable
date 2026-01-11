# DataTable

> Bring your entire business into one app with powerful spreadsheet management

## What is DataTable?

DataTable is a comprehensive business management platform that consolidates all your operational needs into a single, intuitive spreadsheet-based application. Built with Next.js and modern web technologies, DataTable provides a familiar spreadsheet interface while offering the power and flexibility of a full-featured business management system.

## Vision

The goal of DataTable is to eliminate the complexity of managing multiple disconnected tools and platforms. Whether you're tracking inventory, managing orders, monitoring staff attendance, or tracking project progress, DataTable brings everything together in one unified workspace.

**One App. Multiple Spreadsheets. Infinite Possibilities.**

## Key Features

### Real-Time Spreadsheet Interface
- **Excel-like Experience**: Familiar spreadsheet interface with click-to-edit cells
- **Instant Updates**: Real-time data synchronization with server-side persistence
- **Smart Editing**: Intelligent cell editing with type-specific inputs (text, numbers, dates, dropdowns)
- **Visual Feedback**: Clear indicators for unsaved changes and successful saves

### Flexible Data Management
- **Add & Delete Rows**: Easily manage your data with intuitive row operations
- **Batch Operations**: Update multiple rows simultaneously for efficient data management
- **Data Protection**: Built-in safeguards with locked item names to prevent accidental modifications
- **Status Tracking**: Customizable status fields (Active, Inactive, Pending, Completed)

### Business Use Cases

DataTable adapts to your business needs with multiple spreadsheets, each handling different aspects of your operations:

#### Inventory Management
- Track stock levels in real-time
- Monitor item quantities and units
- Set reorder points and alerts
- Categorize products for better organization

#### Order Management
- Track customer orders and fulfillment status
- Monitor order dates and deadlines
- Update order statuses as they progress
- Manage order quantities and specifications

#### Staff Management
- Clock-in/clock-out tracking
- Shift scheduling and management
- Staff availability monitoring
- Time-off requests and approvals

#### Project Tracking
- Task progress monitoring
- Milestone tracking
- Team assignments
- Deadline management

#### Sales Tracking
- Revenue monitoring
- Sales target tracking
- Product performance analysis
- Customer order history

#### Asset Management
- Equipment tracking
- Maintenance schedules
- Asset location monitoring
- Depreciation tracking

## Technology Stack

DataTable is built with cutting-edge web technologies for maximum performance and reliability:

- **Frontend**: React 19 with Next.js 16
- **UI Framework**: Tailwind CSS 4
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Clerk
- **Monitoring**: Sentry for error tracking
- **Security**: Arcjet for API protection
- **Internationalization**: next-intl for multi-language support

## Getting Started

### Prerequisites

- Node.js 20 or higher
- PostgreSQL database
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd DataTable
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
- Database connection string
- Clerk authentication keys
- Other service credentials

4. Run database migrations:
```bash
pnpm db:migrate
```

5. Start the development server:
```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

### Set up authentication

Create a Clerk account at [Clerk.com](https://clerk.com) and create a new application in the Clerk Dashboard. Copy the `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` values and add them to the `.env.local` file:

```shell
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_pub_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

### Set up database

The project uses DrizzleORM with PostgreSQL. When you launch the project locally for the first time, it automatically creates a temporary PostgreSQL database.

This temporary database will **expire after 72 hours** if you don't claim it. To make the database **persistent**, run:

```shell
pnpm run neon:claim
```

## Usage

### Creating Your First Spreadsheet

1. Navigate to the dashboard
2. Click "Add Row" to create a new entry
3. Fill in the required fields:
   - **Item Name**: The identifier for your entry
   - **Quantity**: Numeric value (inventory count, hours, etc.)
   - **Unit**: Measurement unit (pcs, kg, hours, etc.)
   - **Status**: Current state (Active, Pending, Completed, Inactive)
   - **Date**: Relevant date for the entry
   - **Category**: Optional categorization

4. Click "Save Changes" to persist your data

### Editing Data

- **Single Click**: Select a cell to edit (except locked item names)
- **Double Click**: Quick edit mode
- **Tab/Enter**: Navigate between cells
- **Escape**: Cancel editing

### Managing Rows

- **Add Row**: Click the "Add Row" button in the toolbar
- **Delete Row**: Click the delete button in the row's action column
- **Batch Update**: Modify multiple rows and save all changes at once

### Lock/Unlock Feature

The lock toggle in the toolbar controls whether item names can be edited for new rows:
- **Locked** (default): Item names are read-only, preventing accidental changes
- **Unlocked**: Item names can be edited for newly created rows

## Database Schema

The core data structure includes:

```typescript
{
  id: number; // Unique identifier
  itemName: string; // Name/description of the item
  quantity: number; // Numeric value
  unit: string; // Unit of measurement
  status: string; // Current status
  date: string | null; // Associated date
  categoryName: string | null; // Category classification
}
```

## Development

### Available Scripts

- `pnpm dev`: Start development server
- `pnpm build`: Build for production
- `pnpm start`: Start production server
- `pnpm lint`: Run ESLint
- `pnpm test`: Run tests
- `pnpm db:studio`: Open Drizzle Studio for database management
- `pnpm db:migrate`: Run database migrations

### Code Quality

The project uses:
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Vitest for unit testing
- Playwright for E2E testing

## Project Structure

```
src/
├── app/
│   └── [locale]/
│       ├── DataTable.ts          # Server actions for CRUD operations
│       ├── DataTableUI.tsx       # Client-side spreadsheet component
│       ├── dashboard/            # Dashboard pages
│       └── page.tsx             # Main page
├── libs/
│   └── DB.ts                    # Database configuration
├── models/
│   ├── Schema.ts                # Drizzle schema definitions
│   └── Relations.ts             # Database relations
└── components/                   # Reusable components
```

### Modifying Database Schema

To modify the database schema, update the schema file at [src/models/Schema.ts](src/models/Schema.ts).

After making changes, generate a migration:

```shell
pnpm run db:generate
```

Then apply the migration:

```shell
pnpm run db:migrate
```

### Commit Message Format

The project follows the [Conventional Commits](https://www.conventionalcommits.org/) specification, meaning all commit messages must be formatted accordingly. To help you write commit messages, the project provides an interactive CLI that guides you through the commit process. To use it, run the following command:

```shell
npm run commit
```

One of the benefits of using Conventional Commits is the ability to automatically generate GitHub releases. It also allows us to automatically determine the next version number based on the types of commits that are included in a release.

### CodeRabbit AI Code Reviews

The project uses [CodeRabbit](https://www.coderabbit.ai?utm_source=next_js_starter&utm_medium=github&utm_campaign=next_js_starter_oss_2025), an AI-powered code reviewer. CodeRabbit monitors your repository and automatically provides intelligent code reviews on all new pull requests using its powerful AI engine.

Setting up CodeRabbit is simple, visit [coderabbit.ai](https://www.coderabbit.ai?utm_source=next_js_starter&utm_medium=github&utm_campaign=next_js_starter_oss_2025), sign in with your GitHub account, and add your repository from the dashboard. That's it!

### Testing

All unit tests are located alongside the source code in the same directory, making them easier to find. The unit test files follow this format: `*.test.ts` or `*.test.tsx`. The project uses Vitest and React Testing Library for unit testing. You can run the tests with the following command:

```shell
npm run test
```

### Integration & E2E Testing

The project uses Playwright for integration and end-to-end (E2E) testing. Integration test files use the `*.spec.ts` extension, while E2E test files use the `*.e2e.ts` extension. You can run the tests with the following commands:

```shell
npx playwright install # Only for the first time in a new environment
npm run test:e2e
```

### Storybook

Storybook is configured for UI component development and testing. The project uses Storybook with Next.js and Vite integration, including accessibility testing and documentation features.

Stories are located alongside your components in the `src` directory and follow the pattern `*.stories.ts` or `*.stories.tsx`.

You can run Storybook in development mode with:

```shell
npm run storybook
```

This will start Storybook on http://localhost:6006 where you can view and interact with your UI components in isolation.

To run Storybook tests in headless mode, you can use the following command:

```shell
npm run storybook:test
```

### Local Production Build

Generate an optimized production build locally using a temporary in-memory Postgres database:

```shell
npm run build-local
```

This command:

- Starts a temporary in-memory Database server
- Runs database migrations with Drizzle Kit
- Builds the Next.js app for production
- Shuts down the temporary DB when the build finishes

Notes:

- By default, it uses a local database, but you can also use `npm run build` with a remote database.
- This only creates the build, it doesn't start the server. To run the build locally, use `npm run start`.

### Deploy to production

During the build process, database migrations are automatically executed, so there's no need to run them manually. However, you must define `DATABASE_URL` in your environment variables.

Then, you can generate a production build with:

```shell
$ npm run build
```

It generates an optimized production build of the boilerplate. To test the generated build, run:

```shell
$ npm run start
```

You also need to defined the environment variables `CLERK_SECRET_KEY` using your own key.

This command starts a local server using the production build. You can now open http://localhost:3000 in your preferred browser to see the result.

### Deploy to Sevalla

You can deploy a Next.js application along with its database on a single platform. First, create an account on [Sevalla](https://sevalla.com).

After registration, you will be redirected to the dashboard. From there, navigate to `Database > Create a database`. Select PostgreSQL and and use the default settings for a quick setup. For advanced users, you can customize the database location and resource size. Finally, click on `Create` to complete the process.

Once the database is created and ready, return to the dashboard and click `Application > Create an App`. After connecting your GitHub account, select the repository you want to deploy. Keep the default settings for the remaining options, then click `Create`.

Next, connect your database to your application by going to `Networking > Connected services > Add connection` and select the database you just created. You also need to enable the `Add environment variables to the application` option, and rename `DB_URL` to `DATABASE_URL`. Then, click `Add connection`.

Go to `Environment variables > Add environment variable`, and define the environment variables `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` from your Clerk account. Click `Save`.

Finally, initiate a new deployment by clicking `Overview > Latest deployments > Deploy now`. If everything is set up correctly, your application will be deployed successfully with a working database.

### Error Monitoring

The project uses [Sentry](https://sentry.io/for/nextjs/?utm_source=github&utm_medium=paid-community&utm_campaign=general-fy25q1-nextjs&utm_content=github-banner-nextjsboilerplate-logo) to monitor errors.

#### Local development with Sentry and Spotlight

In the development environment, no additional setup is required: Next.js Boilerplate comes pre-configured with Sentry and Spotlight (Sentry for Development). All errors are automatically captured by your local Spotlight instance, enabling testing without sending data to Sentry Cloud.

You can inspect captured events, view stack traces, and analyze errors in the Spotlight UI at `http://localhost:8969`.

#### Production setup with Sentry

For production environment, you'll need to create a Sentry account and a new project. Then, in `.env.production`, you need to update the following environment variables:

```shell
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_ORGANIZATION=
SENTRY_PROJECT=
```

You also need to create a environment variable `SENTRY_AUTH_TOKEN` in your hosting provider's dashboard.

### Code coverage

Next.js Boilerplate relies on [Codecov](https://about.codecov.io/codecov-free-trial/?utm_source=github&utm_medium=paid-community&utm_campaign=general-fy25q1-nextjs&utm_content=github-banner-nextjsboilerplate-logo) for code coverage reporting solution. To enable Codecov, create a Codecov account and connect it to your GitHub account. Your repositories should appear on your Codecov dashboard. Select the desired repository and copy the token. In GitHub Actions, define the `CODECOV_TOKEN` environment variable and paste the token.

Make sure to create `CODECOV_TOKEN` as a GitHub Actions secret, do not paste it directly into your source code.

### Logging

The project uses LogTape for logging. In the development environment, logs are displayed in the console by default.

For production, the project is already integrated with [Better Stack](https://betterstack.com/?utm_source=github&utm_medium=sponsorship&utm_campaign=next-js-boilerplate) to manage and query your logs using SQL. To use Better Stack, you need to create a [Better Stack](https://betterstack.com/?utm_source=github&utm_medium=sponsorship&utm_campaign=next-js-boilerplate) account and create a new source: go to your Better Stack Logs Dashboard > Sources > Connect source. Then, you need to give a name to your source and select Node.js as the platform.

After creating the source, you will be able to view and copy your source token. In your environment variables, paste the token into the `NEXT_PUBLIC_BETTER_STACK_SOURCE_TOKEN` variable. You'll also need to define the `NEXT_PUBLIC_BETTER_STACK_INGESTING_HOST` variable, which can be found in the same place as the source token.

Now, all logs will automatically be sent to and ingested by Better Stack.

### Checkly monitoring

The project uses [Checkly](https://www.checklyhq.com/?utm_source=github&utm_medium=sponsorship&utm_campaign=next-js-boilerplate) to ensure that your production environment is always up and running. At regular intervals, Checkly runs the tests ending with `*.check.e2e.ts` extension and notifies you if any of the tests fail. Additionally, you have the flexibility to execute tests from multiple locations to ensure that your application is available worldwide.

To use Checkly, you must first create an account on [their website](https://www.checklyhq.com/?utm_source=github&utm_medium=sponsorship&utm_campaign=next-js-boilerplate). After creating an account, generate a new API key in the Checkly Dashboard and set the `CHECKLY_API_KEY` environment variable in GitHub Actions. Additionally, you will need to define the `CHECKLY_ACCOUNT_ID`, which can also be found in your Checkly Dashboard under User Settings > General.

To complete the setup, update the `checkly.config.ts` file with your own email address and production URL.

### Arcjet security and bot protection

The project uses [Arcjet](https://launch.arcjet.com/Q6eLbRE), a security as code product that includes several features that can be used individually or combined to provide defense in depth for your site.

To set up Arcjet, [create a free account](https://launch.arcjet.com/Q6eLbRE) and get your API key. Then add it to the `ARCJET_KEY` environment variable.

Arcjet is configured with two main features: bot detection and the Arcjet Shield WAF:

- [Bot detection](https://docs.arcjet.com/bot-protection/concepts) is configured to allow search engines, preview link generators e.g. Slack and Twitter previews, and to allow common uptime monitoring services. All other bots, such as scrapers and AI crawlers, will be blocked. You can [configure additional bot types](https://docs.arcjet.com/bot-protection/identifying-bots) to allow or block.
- [Arcjet Shield WAF](https://docs.arcjet.com/shield/concepts) will detect and block common attacks such as SQL injection, cross-site scripting, and other OWASP Top 10 vulnerabilities.

Arcjet is configured with a central client at `src/libs/Arcjet.ts` that includes the Shield WAF rules. Additional rules are applied when Arcjet is called in `proxy.ts`.

### Useful commands

### Code Quality and Validation

The project includes several commands to ensure code quality and consistency. You can run:

- `npm run lint` to check for linting errors
- `npm run lint:fix` to automatically fix fixable issues from the linter
- `npm run check:types` to verify type safety across the entire project
- `npm run check:deps` help identify unused dependencies and files
- `npm run check:i18n` ensures all translations are complete and properly formatted

#### Bundle Analyzer

Next.js Boilerplate includes a built-in bundle analyzer. It can be used to analyze the size of your JavaScript bundles. To begin, run the following command:

```shell
npm run build-stats
```

By running the command, it'll automatically open a new browser window with the results.

#### Database Studio

The project is already configured with Drizzle Studio to explore the database. You can run the following command to open the database studio:

```shell
npm run db:studio
```

Then, you can open https://local.drizzle.studio with your favorite browser to explore your database.

### VSCode information (optional)

If you are VSCode user, you can have a better integration with VSCode by installing the suggested extension in `.vscode/extension.json`. The starter code comes up with Settings for a seamless integration with VSCode. The Debug configuration is also provided for frontend and backend debugging experience.

With the plugins installed in your VSCode, ESLint and Prettier can automatically fix the code and display errors. The same applies to testing: you can install the VSCode Vitest extension to automatically run your tests, and it also shows the code coverage in context.

Pro tips: if you need a project wide-type checking with TypeScript, you can run a build with <kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>B</kbd> on Mac.

### Contributions

Everyone is welcome to contribute to this project. Feel free to open an issue if you have any questions or find a bug. Totally open to suggestions and improvements.

### License

Licensed under the MIT License, Copyright © 2025

See [LICENSE](LICENSE) for more information.

## Sponsors

<table width="100%">
  <tr height="187px">
    <td align="center" width="33%">
      <a href="https://clerk.com?utm_source=github&utm_medium=sponsorship&utm_campaign=nextjs-boilerplate">
        <picture>
          <source media="(prefers-color-scheme: dark)" srcset="https://github.com/ixartz/SaaS-Boilerplate/assets/1328388/6fb61971-3bf1-4580-98a0-10bd3f1040a2">
          <source media="(prefers-color-scheme: light)" srcset="https://github.com/ixartz/SaaS-Boilerplate/assets/1328388/f80a8bb5-66da-4772-ad36-5fabc5b02c60">
          <img alt="Clerk – Authentication & User Management for Next.js" src="https://github.com/ixartz/SaaS-Boilerplate/assets/1328388/f80a8bb5-66da-4772-ad36-5fabc5b02c60">
        </picture>
      </a>
    </td>
    <td align="center" width="33%">
      <a href="https://www.coderabbit.ai?utm_source=next_js_starter&utm_medium=github&utm_campaign=next_js_starter_oss_2025">
        <picture>
          <source media="(prefers-color-scheme: dark)" srcset="public/assets/images/coderabbit-logo-dark.svg?raw=true">
          <source media="(prefers-color-scheme: light)" srcset="public/assets/images/coderabbit-logo-light.svg?raw=true">
          <img alt="CodeRabbit" src="public/assets/images/coderabbit-logo-light.svg?raw=true">
        </picture>
      </a>
    </td>
    <td align="center" width="33%">
      <a href="https://sentry.io/for/nextjs/?utm_source=github&utm_medium=paid-community&utm_campaign=general-fy25q1-nextjs&utm_content=github-banner-nextjsboilerplate-logo">
        <picture>
          <source media="(prefers-color-scheme: dark)" srcset="public/assets/images/sentry-white.png?raw=true">
          <source media="(prefers-color-scheme: light)" srcset="public/assets/images/sentry-dark.png?raw=true">
          <img alt="Sentry" src="public/assets/images/sentry-dark.png?raw=true">
        </picture>
      </a>
      <a href="https://about.codecov.io/codecov-free-trial/?utm_source=github&utm_medium=paid-community&utm_campaign=general-fy25q1-nextjs&utm_content=github-banner-nextjsboilerplate-logo">
        <picture>
          <source media="(prefers-color-scheme: dark)" srcset="public/assets/images/codecov-white.svg?raw=true">
          <source media="(prefers-color-scheme: light)" srcset="public/assets/images/codecov-dark.svg?raw=true">
          <img alt="Codecov" src="public/assets/images/codecov-dark.svg?raw=true">
        </picture>
      </a>
    </td>
  </tr>
  <tr height="187px">
    <td align="center" width="33%">
      <a href="https://launch.arcjet.com/Q6eLbRE">
        <picture>
          <source media="(prefers-color-scheme: dark)" srcset="public/assets/images/arcjet-dark.svg?raw=true">
          <source media="(prefers-color-scheme: light)" srcset="public/assets/images/arcjet-light.svg?raw=true">
          <img alt="Arcjet" src="public/assets/images/arcjet-light.svg?raw=true">
        </picture>
      </a>
    </td>
    <td align="center" width="33%">
      <a href="https://sevalla.com/">
        <picture>
          <source media="(prefers-color-scheme: dark)" srcset="public/assets/images/sevalla-dark.png">
          <source media="(prefers-color-scheme: light)" srcset="public/assets/images/sevalla-light.png">
          <img alt="Sevalla" src="public/assets/images/sevalla-light.png">
        </picture>
      </a>
    </td>
    <td align="center" width="33%">
      <a href="https://l.crowdin.com/next-js">
        <picture>
          <source media="(prefers-color-scheme: dark)" srcset="public/assets/images/crowdin-white.png?raw=true">
          <source media="(prefers-color-scheme: light)" srcset="public/assets/images/crowdin-dark.png?raw=true">
          <img alt="Crowdin" src="public/assets/images/crowdin-dark.png?raw=true">
        </picture>
      </a>
    </td>
  </tr>
  <tr height="187px">
    <td align="center" width="33%">
      <a href="https://betterstack.com/?utm_source=github&utm_medium=sponsorship&utm_campaign=next-js-boilerplate">
        <picture>
          <source media="(prefers-color-scheme: dark)" srcset="public/assets/images/better-stack-white.png?raw=true">
          <source media="(prefers-color-scheme: light)" srcset="public/assets/images/better-stack-dark.png?raw=true">
          <img alt="Better Stack" src="public/assets/images/better-stack-dark.png?raw=true">
        </picture>
      </a>
    </td>
    <td align="center" width="33%">
      <a href="https://posthog.com/?utm_source=github&utm_medium=sponsorship&utm_campaign=next-js-boilerplate">
        <picture>
          <source media="(prefers-color-scheme: dark)" srcset="https://posthog.com/brand/posthog-logo-white.svg">
          <source media="(prefers-color-scheme: light)" srcset="https://posthog.com/brand/posthog-logo.svg">
          <img alt="PostHog" src="https://posthog.com/brand/posthog-logo.svg">
        </picture>
      </a>
    </td>
    <td align="center" width="33%">
      <a href="https://www.checklyhq.com/?utm_source=github&utm_medium=sponsorship&utm_campaign=next-js-boilerplate">
        <picture>
          <source media="(prefers-color-scheme: dark)" srcset="public/assets/images/checkly-logo-dark.png?raw=true">
          <source media="(prefers-color-scheme: light)" srcset="public/assets/images/checkly-logo-light.png?raw=true">
          <img alt="Checkly" src="public/assets/images/checkly-logo-light.png?raw=true">
        </picture>
      </a>
    </td>
  </tr>
  <tr height="187px">
    <td align="center" style=width="33%">
      <a href="https://nextjs-boilerplate.com/pro-saas-starter-kit">
        <img src="public/assets/images/nextjs-boilerplate-saas.png?raw=true" alt="Next.js SaaS Boilerplate with React" />
      </a>
    </td>
    <td align="center" width="33%">
      <a href="mailto:contact@creativedesignsguru.com">
        Add your logo here
      </a>
    </td>
  </tr>
</table>

---

Made with ♥ by [CreativeDesignsGuru](https://creativedesignsguru.com) [![Twitter](https://img.shields.io/twitter/url/https/twitter.com/cloudposse.svg?style=social&label=Follow%20%40Ixartz)](https://twitter.com/ixartz)

Looking for a custom boilerplate to kick off your project? I'd be glad to discuss how I can help you build one. Feel free to reach out anytime at contact@creativedesignsguru.com!

[![Sponsor Next JS Boilerplate](https://cdn.buymeacoffee.com/buttons/default-red.png)](https://github.com/sponsors/ixartz)
