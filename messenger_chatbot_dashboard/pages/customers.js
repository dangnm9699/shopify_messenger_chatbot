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
  const res = await fetch(
    process.env.NODE_ENV == "production"
      ? `${process.env.HOST}/orders`
      : "http://localhost:8081/orders",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const json = await res.json();
  await new Promise((resolve) => {
    setTimeout(resolve, 1500);
  });
  return {
    orders: json.orders,
  };
};
