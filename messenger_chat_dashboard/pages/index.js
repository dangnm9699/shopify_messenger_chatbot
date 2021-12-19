import { Page } from "@shopify/polaris";

export default function Index() {
  return (
    <div className="page-container">
      <Page fullWidth>
        <div className="general"></div>
        <div className="charts"></div>
      </Page>
    </div>
  );
}
