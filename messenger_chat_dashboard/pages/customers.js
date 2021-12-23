import { Page } from "@shopify/polaris";
import { useRouter } from "next/dist/client/router";

export default function Customers({ orders }) {
  const router = useRouter();

  console.log(router.pathname);

  return (
    <div className="page-container">
      <Page fullWidth>
        <div className="general"></div>
        <div className="charts"></div>
      </Page>
    </div>
  );
}

Customers.getInitialProps = async (ctx) => {
  const res = await fetch("/orders", { method: "POST" });
  const json = await res.json();
  return {
    orders: json.orders,
  };
};
