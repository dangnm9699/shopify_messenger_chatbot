import { Card, Page } from "@shopify/polaris";
import DateChooser from "../components/DateChooser";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const OrderHelper = require("../helpers").OrderHelper;
const CommonHelper = require("../helpers").CommonHelper;

export default function Orders({
  originalOrders,
  minMax: { startDate, endDate, startMinus1Date, endPlus1Date },
}) {
  const [orders, setOrders] = useState([...originalOrders]);
  const [loading, setLoading] = useState(false);

  const { avgValuePerOrder } = OrderHelper.getAvgByDateRange(orders);

  const orderByDate = OrderHelper.getOrderCountByDate(orders).sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at)
  );

  const orderMinMaxByDate = OrderHelper.getOrderMinMaxByDate(orders).sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at)
  );

  const chart_data_orders_count = {
    labels: orderByDate.map((date) => date.created_at),
    datasets: [
      {
        data: orderByDate.map((date) => parseInt(date.quantity)),
        label: "Order Count",
        borderColor: "rgba(0, 128, 96, 1)",
        backgroundColor: "rgba(0, 128, 96, 1)",
        fill: false,
      },
    ],
  };

  const chart_data_orders_min_max = {
    labels: orderMinMaxByDate.map((date) => date.created_at),
    datasets: [
      {
        data: orderMinMaxByDate.map((date) => parseFloat(date.max)),
        label: "Max",
        borderColor: "rgba(0, 128, 96, 1)",
        backgroundColor: "rgba(0, 128, 96, 1)",
        fill: false,
      },
      {
        data: orderMinMaxByDate.map((date) => parseFloat(date.min)),
        label: "Min",
        borderColor: "rgba(216, 44, 13, 1)",
        backgroundColor: "rgba(216, 44, 13, 1)",
        fill: false,
      },
    ],
  };

  return (
    <div className="page-container">
      <Page fullWidth>
        <div className="orders general">
          <div className="" style={{ width: "calc(60% - 1.5rem)" }}>
            <DateChooser
              id={"date-picker-orders"}
              setOrders={setOrders}
              startDate={startDate}
              endDate={endDate}
              startMinus1Date={startMinus1Date}
              loading={loading}
              setLoading={setLoading}
            />
          </div>
          <div
            className="orders__average-value"
            style={{ width: "calc(40% - 1.5rem)" }}
          >
            <Card title="Avg. Value/Order" sectioned>
              <div
                style={{
                  width: "100%",
                  textAlign: "center",
                  fontWeight: "600",
                  fontSize: "2rem",
                  padding: "0.25rem",
                }}
              >
                {CommonHelper.numberWithCommas(avgValuePerOrder)}
              </div>
            </Card>
          </div>
        </div>
        <br />
        <hr />
        <br />
        <div className="orders charts">
          <div className="orders__count">
            <Card title="Orders Quantity In The Nearest Week" sectioned>
              <div style={{ height: "300px" }}>
                <Line
                  data={chart_data_orders_count}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                />
              </div>
            </Card>
          </div>
          <div className="orders__min-max">
            <Card title="Orders Min/Max Value In The Nearest Week" sectioned>
              <div style={{ height: "300px" }}>
                <Line
                  data={chart_data_orders_min_max}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                />
              </div>
            </Card>
          </div>
        </div>
      </Page>
    </div>
  );
}

Orders.getInitialProps = async (ctx) => {
  const ordersRes = await fetch("http://localhost:8081/orders", {
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
    minMax: min_max,
  };
};
