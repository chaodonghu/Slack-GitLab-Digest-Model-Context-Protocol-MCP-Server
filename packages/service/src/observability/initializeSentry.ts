import * as Sentry from "@sentry/react";
import { ExtraErrorData } from "@sentry/integrations";

import { isProduction } from "../utils/environment";

const ignoreErrors = [
  // Ignore http://bit.ly/2hk42Ap, resulting from what
  // appears to be a Chrome bug http://bit.ly/2gVbncS
  /__gCrWeb\.autofill\.extractForms/,
  // Ignore http://bit.ly/2hk71Zv, resulting from
  // some really strange issue in Safari 9. Experienced
  // by Mozilla team, too http://bit.ly/2hk9vHq
  /docs-homescreen-gb-container/,
  // Ignore http://bit.ly/2mVGcgX. It's a weird react error.
  // Google says it _might_ be a logging error? http://bit.ly/2lEB3ZW
  /e\.getHostNode/,
  // Ignore http://bit.ly/2lyZSao, resulting from
  // some Chrome plugin presumably.
  /ahk_main/,
  // Some weird firefox errors that seem to happen only on firefox for iOS.
  // https://bugzilla.mozilla.org/show_bug.cgi?id=1394296
  /__firefox__\./,
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function censorSensitiveInformation(event: any) {
  const keys = ["password", "secret", /token$/i, "credentials"];

  for (const eventKey in event) {
    const removeKey = keys.reduce(
      (result, key) => result || eventKey.match(key) !== null,
      false,
    );

    if (removeKey) {
      delete event[eventKey];
    } else if (typeof event[eventKey] === "object") {
      censorSensitiveInformation(event[eventKey]);
    }
  }
}

export default function initializeSentry(config: {
  dsn: string;
  commitHash?: string;
  environment?: string;
}) {
  // Cannot initialize Sentry without a dsn
  if (!config.dsn) {
    return;
  }

  const { commitHash, dsn } = config;

  Sentry.init({
    dsn,

    environment: config.environment,

    // Associate error events with a release version, so we can track which
    // release introduced new bugs. More info on Sentry releases:
    // https://docs.sentry.io/learn/releases/
    release: commitHash || "unknown-browser-release",

    integrations: [
      // Extracts all non-native attributes from the Error object and attaches
      // them to the event as the `extra` data.
      // https://docs.sentry.io/platforms/javascript/#extraerrordata
      new ExtraErrorData(),
    ],

    beforeSend(event: Sentry.Event) {
      let ignore = false;

      if (event.exception) {
        const values = event.exception?.values || [];
        values.forEach((exception) => {
          ignoreErrors.forEach((error) => {
            ignore = ignore || exception?.value?.match(error) !== null;
          });
        });
      }

      if (ignore) {
        return null;
      }

      censorSensitiveInformation(event);

      if (!isProduction) {
        /* eslint-disable-next-line no-console */
        console.info("Would have captured exception", event);
        return null;
      }

      return event;
    },
  });
}
