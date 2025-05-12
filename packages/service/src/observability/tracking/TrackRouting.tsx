import { Fragment, useEffect } from "react";
import { usePathname } from "next/navigation";

import { isDatadog } from "../../utils/isDatadog";
import emitEvent from "./emitEvent";

type Props = {
  children: React.ReactNode;
};

export function TrackRouting({ children }: Props) {
  const pathname = usePathname();

  const path = pathname || "";

  useEffect(() => {
    // Only track on the client side
    // and do not track the pre-hydrated path that doesn't include the
    // real params (i.e. [accountId])
    if (!(path.includes("[") && path.includes("]")) && !isDatadog()) {
      // emit an Avro PageViewEvent in parallel with the pre-Avro nagivate event.
      // this will allow us to begin shifting services over to exclusive use of
      // the PageViewEvent by the end of 2021 (when the necessary ETL adjustments
      // have been incorporated for attribution, etc.)

      // We only need to specify the system name that should be used for the PageViewEvent
      // The other PageViewEvent fields are set by automatically by events-toolkit-browser and the v4 Events API
      // https://engineering.zapier.com/guides/event-streaming/tracking-events/
      emitEvent("web_analytics.tracking.page_view.PageViewEvent");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  return <Fragment>{children}</Fragment>;
}
