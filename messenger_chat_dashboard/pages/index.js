import { Card, DataTable, Link, Page } from "@shopify/polaris";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useState } from "react";
import DateChooser from "../components/DateChooser";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const CommonHelper = require("../helpers").CommonHelper;
const SaleHelper = require("../helpers").SaleHelper;

export default function Index({
  originalOrders,
  domain,
  minMax: { startDate, endDate, startMinus1Date, endPlus1Date },
}) {
  const [orders, setOrders] = useState([...originalOrders]);
  const [loading, setLoading] = useState(false);

  const topProducts = SaleHelper.getTopProductsByUnitSold(orders)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  const productCountByDate = SaleHelper.getProductCountByDate(orders).sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at)
  );

  const revenueByDate = SaleHelper.getRevenueByDate(orders).sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at)
  );

  const rows = [];
  topProducts.forEach((product) => {
    rows.push([
      <Link
        removeUnderline
        url={`https://${domain}/admin/products/${product.id}`}
        external
      >
        {product.title}
      </Link>,
      product.quantity,
    ]);
  });

  const chart_data_sale = {
    labels: productCountByDate.map((date) => date.created_at),
    datasets: [
      {
        data: productCountByDate.map((date) => parseInt(date.quantity)),
        label: "Product Count",
        borderColor: "rgba(0, 128, 96, 1)",
        backgroundColor: "rgba(0, 128, 96, 1)",
        fill: false,
      },
    ],
  };

  const chart_data_revenue = {
    labels: revenueByDate.map((date) => date.created_at),
    datasets: [
      {
        data: revenueByDate.map((date) => parseFloat(date.revenue)),
        label: "Revenue",
        borderColor: "rgba(0, 128, 96, 1)",
        backgroundColor: "rgba(0, 128, 96, 1)",
        fill: false,
      },
    ],
  };

  return (
    <div className="page-container">
      <Page fullWidth>
        <div className="">
          <DateChooser
            id={"date-picker-sale"}
            setOrders={setOrders}
            startDate={startDate}
            endDate={endDate}
            startMinus1Date={startMinus1Date}
            loading={loading}
            setLoading={setLoading}
          />
        </div>
        <br />
        <div className="sale general">
          <div className="sale__top-products-sold">
            <Card title="TOP 5 products by units sold" sectioned>
              <DataTable
                columnContentTypes={["text", "numeric"]}
                headings={["Title", "Quantity"]}
                rows={rows}
              />
            </Card>
          </div>
          <div className="sale__top_products-chatbot">
            <Card title="TOP 5 products by Chatbot interests" sectioned></Card>
          </div>
        </div>
        <br />
        <div className="sale charts">
          <div className="sale__volume">
            <Card title="Products Quantity In The Nearest Week" sectioned>
              <div style={{ height: "300px" }}>
                <Line
                  data={chart_data_sale}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                />
              </div>
            </Card>
          </div>
          <br />
          <div className="sale__revenue">
            <Card title="Revenue In The Nearest Week" sectioned>
              <div style={{ height: "300px" }}>
                <Line
                  data={chart_data_revenue}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                />
              </div>
            </Card>
          </div>
          <br />
        </div>
      </Page>
    </div>
  );
}

Index.getInitialProps = async (ctx) => {
  const shopRes = await fetch("http://localhost:8081/shop-information", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const shopResJson = await shopRes.json();

  const ordersRes = await fetch(`http://localhost:8081/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const ordersResJson = await ordersRes.json();
  await new Promise((resolve) => {
    setTimeout(resolve, 1500);
  });
  const min_max = CommonHelper.getFirstAndLastDate(ordersResJson.orders);
  return {
    originalOrders: ordersResJson.orders,
    domain: shopResJson.shop.domain,
    minMax: min_max,
  };
};
