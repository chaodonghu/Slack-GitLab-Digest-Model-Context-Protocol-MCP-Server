import { useSplitTreatments } from "@splitsoftware/splitio-react";
import { Spinner } from "@zapier/design-system";

const featureName = "SayHello";

type IsSplitFeatureActiveProps = {
  isActive: boolean;
};

const IsSplitFeatureActive: React.FC<IsSplitFeatureActiveProps> = ({
  isActive,
}) => (
  <h4 style={{ textAlign: "center", marginBottom: "2rem" }}>
    Sample client-side feature toggle: {isActive ? "Active" : "Inactive"}
  </h4>
);

function renderContent(treatmentWithConfig: any, props: any) {
  const { treatment, config } = treatmentWithConfig;
  if (treatment === "on")
    return <IsSplitFeatureActive config={config} isActive={true} {...props} />;
  return <IsSplitFeatureActive config={config} isActive={false} {...props} />;
}

// The Split config can be found in AppLayout.tsx.
function SplitExample(props: any) {
  const { treatments, isReady } = useSplitTreatments({ names: [featureName] });
  return isReady ? (
    renderContent(treatments[featureName], props) // Use the treatments and configs.
  ) : (
    <Spinner />
  ); // Render a spinner if the SDK is not ready yet.
}
export default SplitExample;
