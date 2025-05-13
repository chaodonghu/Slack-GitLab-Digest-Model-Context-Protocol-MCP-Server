# Next.js Template Features

> 🗑 After you are familiar with all of the features of the Next.js template, feel free to delete this file.

Some features come from Bakery and some come directly from this template:

- 🍰 - Created from Bakery
- 🗺 - Created from Next.js Template

## Code Environment Setup

### 🗺 [ESLint](./packages/service/.eslintrc.js)

We extend the base `@zapier/eslint-plugin-zapier` eslint plugin.

### 🗺 [TypeScript](./packages/service/tsconfig.json)

TypeScript is setup for the Next.js service

### 🗺 [Babel](./packages/service/babel.config.js)

We use the `next/babel` preset

### 🗺 [Prettier](./packages/service/.prettierignore)

We are using the default Prettier settings. To adapt to your preferences you can add a `.prettierrc.json` file.

## Next.js Setup

### 🗺 [Next Package Transpilation](./packages/service/next.config.js)

You can add any untranspiled packages to the `packagesToTranspile` list so Next.js can tranpile it before consuming.

### 🗺 [Custom Header Configuration](./packages/service/next.config.js)

You can add any [custom headers](https://nextjs.org/docs/api-reference/next.config.js/headers) your service needs to the array returned by the `headers` function. By default, we have one custom header for all routes, `Content-Security-Policy`, and use it to disallow iframe embedding.

### 🗺 [Base Document](./packages/service/src/pages/_document.tsx)

Adds fonts / favicon to the base page.

### 🗺 Vercel-ready

This template features all of the config needed to deploy your app to Vercel and then hook it up to a subpath of zapier.com!

### 🗺 [Hello World Page](./packages/service/src/pages/zhwdailysummarizer/index.tsx)

### 🗺 [Hello World Component](./packages/service/src/components/HelloWorld.tsx)

Hello World page available at `./zhwdailysummarizer`

### 🗺 [Next.js Environment Setup](./packages/service/.env.development)

We are using the [idiomatic Next.js way of setting environment variables](https://nextjs.org/docs/basic-features/environment-variables), using `.env` files that Next.js picks up.

## Dev Environment

### 🗺 [Pull in Template Updates](./bin/update)

We are using `cookiecutter` to generate projects from templates and apply updates.
To install this tool:

```
$ brew install cookiecutter
```

Then, a generated project can be updated from the latest templates using one of the following modes:

- `bin/update` - CI/CD tooling + project settings
- `bin/update --all` - CI/CD tooling + project settings + dependencies
- `bin/update --tooling` - CI/CD tooling only

## Observability

### 🗺 [OpsLevel](./opslevel.yml)

Automatically report service information to [OpsLevel](https://app.opslevel.com/)

### 🍰 [Sentry project setup](https://docs.k8s.zapier.com/bakery/ref/stages/sentry.html)

Creates a Sentry project

### 🗺 [Sentry](./packages/service/src/observability/initializeSentry.ts)

Integrates Sentry tracking

### 🗺 [DataDog RUM](./packages/service/src/observability/datadogRum.ts)

Integrates DataDog RUM tracking

### 🗺 [Google Tag Manager](./packages/service/src/observability/googleTagManager.tsx)

## Testing

### [Vitest unit testing](./packages/service/vitest.config.js)

[Example unit test](./packages/service/src/components/HelloWorld.test.tsx)

Vitest is setup to automatically pick up all `*.test.tsx` files in the `./packages/service/src` directory.

## 🗺 CI/CD workflow

1. PRs target a merge to a branch named `staging`.
2. When a new PR is opened:

- A preview deployment is triggered.

3. When a PR merges into `staging`:

- A staging deployment is triggered.

4. If the merge pipeline succeeds, `staging` gets automatically merged into `main`. This triggers a production deployment.

Be sure to follow the instructions in [Vercel CI/CD Workflow](https://engineering.zapier.com/guides/frontend/vercel/ci-cd-workflow/) to configure the Vercel portion of this setup.

### 🗺 Preview Deployments Powered by Vercel

The template comes pre-configured with everything you need to get your Vercel preview deployments running, and to proxy all unhandles routes to zapier-staging.com.
