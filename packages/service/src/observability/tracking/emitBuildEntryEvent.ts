import { EventZapierPlatformBuildCreationBuildEntryEvent } from "@zapier/avro-events";
import emitEvent from "./emitEvent";

const BuildEntryEvent = "event.zapier.platform.build_creation.BuildEntryEvent";

/**
 * Emits an event.zapier.platform.build_creation.BuildEntryEvent.
 *
 * @param entryMethod - How a user entered into a build experience. Descriptions of methods can be found here: https://coda.io/d/_dRo4F5dxC3W/WIP-Zapier-Creation-Tracking_su8A8_jk#_luekCxjd
 * @param originatingAsset - When a user creates a build experience from within another build experience, field denotes what type of build_experience the new entry was from. Defaults to not_applicable
 * @param originatingAssetID - The unique identifier (ID) of the originating asset, when a user enters a build experience from within another build experience. It could be a zap_id, table_id or a template_id depending on the context from originating_asset field
 * @param templateID - The unique identifier (ID) of the originating template, when a user creates from a Zap Template or NP template. It could be a zap_template_id, zsl_id or a new_product_template_id depending on the context from entry_method field
 *
 * @returns the build creation attempt ID. This ID should be passed to the backend so it can be included in subsequent "created" events (e.g. ZapCreatedEvent, CanvasCreatedEvent).
 */
const emitBuildEntryEvent = async (
  entryMethod: EventZapierPlatformBuildCreationBuildEntryEvent.entry_method_union,
  originatingAsset?: EventZapierPlatformBuildCreationBuildEntryEvent.originating_asset_union,
  originatingAssetID?: string,
  templateID?: string,
): Promise<string> => {
  const buildCreationAttemptId = crypto.randomUUID();

  await emitEvent(BuildEntryEvent, {
    build_creation_attempt_id: buildCreationAttemptId,
    entry_method: entryMethod,
    entry_location: window.location.href,
    originating_asset: originatingAsset || "not_applicable",
    originating_asset_id: originatingAssetID || null,
    template_id: templateID || null,
  });

  return buildCreationAttemptId;
};

export default emitBuildEntryEvent;
