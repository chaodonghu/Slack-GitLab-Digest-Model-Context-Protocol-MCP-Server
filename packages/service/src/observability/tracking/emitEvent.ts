import type {
  EventArgs,
  EventFieldsSetByAPI,
  EventFieldsSetByEventsToolkit,
  EventNameType,
} from "@zapier/avro-events";
import { emit } from "@zapier/events-toolkit-browser";

type RemoveAutoPopulatedEventFields<Type> = {
  [Property in keyof Type as Exclude<
    Property,
    EventFieldsSetByAPI | EventFieldsSetByEventsToolkit
  >]: Type[Property];
};

const emitEvent = <T extends EventNameType>(
  eventName: T,
  customEventData?: RemoveAutoPopulatedEventFields<EventArgs<T>>,
  systemName?: string,
) => {
  // Don't emit events in development
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === "development") {
    console.log(
      `⏰ events-toolkit-browser: would have emitted "${eventName}" event.`,
      {
        system_name: systemName || "zhwdailysummarizer",
        ...customEventData,
      },
    );
    return Promise.resolve() as Promise<any>;
  }

  return emit(
    {
      system_name: systemName || "zhwdailysummarizer",
      ...(customEventData || {}),
    },
    eventName,
  );
};

export default emitEvent;
