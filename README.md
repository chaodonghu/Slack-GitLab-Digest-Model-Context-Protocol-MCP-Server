# Overview

zhwdailysummarizer was generated from the [Next.js template](https://gitlab.com/zapier/nextjs-template) by Bakery.

## Development

To start the app, run:

```bash
pnpm dev
```

The app will be available on <http://localhost:9955/zhwdailysummarizer>. The other paths will proxy to zapier-staging.com.

## Features

See the [features documentation](http://docs.k8s.zapier.com/zhwdailysummarizer/features.html) for a listing of everything that come with the Next.js project template.

## <span style="color:tomato">IMPORTANT!</span> Post-Bakery Manual Setup

Some setup steps are not yet automated. Manual instructions are available below. Complete these steps, and if you run into any problems, feel free to reach out in [#maintainers-nextjs-template](https://zapier.slack.com/archives/C01MVTHR6HK). When you have completed these steps, feel free to delete them from this `README.md`.

### Update the subpath on which your app will attach

The template assumes your app will attach to a subpath of zapier.com named `/zhwdailysummarizer`.

If that's not the right subpath, follow these steps to change it:

1. Rename the `/pages/zhwdailysummarizer` folder.
1. Update the "Development" section of this README to reflect the rename.
1. Find the `.e2e` job in `.gitlab-ci.yml` and update the `VERCEL_URL` passed to the `wait-for-vercel` command to reflect the rename.

If your app will deploy to a standalone zapier subdomain instead, follow these steps:

1. Move the `/pages/zhwdailysummarizer/index` page up to `/pages`.
1. Delete the `/pages/zhwdailysummarizer` folder.
1. Find the `.e2e` job in `.gitlab-ci.yml` and update the `VERCEL_URL` passed to the `wait-for-vercel` command accordingly.

### Configure the `staging` branch

Follow the "Creating the Workflow" section of [the Vercel engineering docs](https://engineering.zapier.com/guides/frontend/vercel/ci-cd-workflow/#creating-the-workflow) to create a `staging` branch, make it the default target branch for Merge Requests, and associate its deployment to `zhwdailysummarizer.vercel.zapier-staging.com`. This ensures end to end tests are run against that project.

### Finish setting up Sentry

To complete the Sentry integration, follow the **Setup** steps. To opt-out, follow the **Removing Sentry** steps.

**Setup:**

1.  A new Sentry project should have been created for you by Bakery. Find your new project in the index [here](https://sentry.io/organizations/zapier-1/projects/).
2.  Navigate to your [project settings DSN keys page](https://sentry.io/settings/zapier-1/projects/zhwdailysummarizer/keys/).
3.  Update the `NEXT_PUBLIC_SENTRY_DSN` variable in `.env` with the DSN value.

**Removing Sentry:**

1.  A new Sentry project should have been created for you by Bakery. Find your new project in the index [here](https://sentry.io/organizations/zapier-1/projects/). Ask #support-production-engineering to remove the project that was created.
2.  Remove:
    1. `packages/service/src/observability/initializeSentry.ts` and its export from the `index.ts` file in the same directory
    2. `NEXT_PUBLIC_SENTRY_DSN=` from the `.env` file
    3. The `initializeSentry()` block and its related imports from `packages/service/src/pages/_app.tsx`

### Finish setting up Datadog RUM

To complete the DataDog RUM integration, follow the **Setup** steps. To opt-out, follow the **Removing DataDog RUM** steps.

**Setup:**

1.  Create a new Datadog RUM application [here](https://zapier.datadoghq.com/rum/application/create)
2.  Navigate to your application settings page by clicking "Edit Application" on your service [here](https://zapier.datadoghq.com/rum/list?live=1d)
3.  Copy the value of `applicationId` to `NEXT_PUBLIC_DATADOG_APP_ID` in `.env`
4.  Copy the value of `clientToken` to `NEXT_PUBLIC_DATADOG_CLIENT_TOKEN` in `.env`

**Removing DataDog RUM:**

To opt out of DataDog RUM, remove the following:

1.  The `packages/service/src/observability/datadogRum.ts` file and its export from `index.ts` in the same directory.
2.  The `NEXT_PUBLIC_DATADOG_APP_ID=` and `NEXT_PUBLIC_DATADOG_CLIENT_TOKEN=` vars from each of the `.env.<environment>` files.
3.  The `initializeDatadogRum()` block, `export const reportWebVitals`, and related imports from `packages/service/src/pages/_app.tsx`.
f
### Finish setting up Google Tag Manager

why gtm

To complete the Google Tag Manager integration, import and render the `GoogleTagManagerScript` in `_app.tsx` file.

#### Testing

To test that the GTM code snippet is firing as expected, you can do one of the following:

1. Search the browser console for `gtm`. ([screenshot](https://cdn.zappy.app/d28381fbef8600525f440ced8a03f033.png))
2. Use a Chrome extension like ‘Google Tag Assistant’ that tells us the snippet is working as expected. ([screenshot](https://cdn.zappy.app/2fe4448b3c3c68a2a861e24ee70162f5.png))
