import { Card, Page } from "@shopify/polaris";
import DateChooser from "../components/DateChooser";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "chartjs-adapter-moment";
import { Line } from "react-chartjs-2";
import { useState } from "react";
import order from "../helpers/order";

ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
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

  const { avgValuePerOrder, numberOfOrders } = OrderHelper.getAvgByDateRange(orders);

  const orderByDate = OrderHelper.getOrderCountByDate(orders).sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at)
  );

  const orderMinMaxByDate = OrderHelper.getOrderMinMaxByDate(orders).sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at)
  );

  const chart_data_orders_count = {
    datasets: [
      {
        data: orderByDate.map((date) => {
          return {
            x: date.created_at,
            y: parseFloat(date.quantity)
          }
        }),
        label: "Order Count",
        borderColor: "rgba(0, 128, 96, 1)",
        backgroundColor: "rgba(0, 128, 96, 1)",
        fill: false,
      },
    ],
  };

  const chart_data_orders_min_max = {
    datasets: [
      {
        data: orderMinMaxByDate.map((date) => {
          return {
            x: date.created_at,
            y: parseFloat(date.max)
          }
        }),
        label: "Max",
        borderColor: "rgba(0, 128, 96, 1)",
        backgroundColor: "rgba(0, 128, 96, 1)",
        fill: false,
      },
      {
        data: orderMinMaxByDate.map((date) => {
          return {
            x: date.created_at,
            y: parseFloat(date.min)
          }
        }),
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
        <div className="orders fullwidth">
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
            className="two-fifth"
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

            <Card title="Number of Orders" sectioned>
              <div
                style={{
                  width: "100%",
                  textAlign: "center",
                  fontWeight: "600",
                  fontSize: "2rem",
                  padding: "0.25rem",
                }}
              >
                {`${CommonHelper.numberWithCommas(numberOfOrders)} orders`}
              </div>
            </Card>
          </div>
        </div>
        <br />
        <hr />
        <br />
        <div className="orders fullwidth">
          <div className="orders__count">
            <Card title="Orders Quantity" sectioned>
              <div style={{ height: "300px" }}>
                <Line
                  data={chart_data_orders_count}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      x: {
                        type: "time",
                        time: {
                          unit: "day",
                          stepSize: 1
                        }
                      }
                    }
                  }}
                />
              </div>
            </Card>
          </div>
          <div className="orders__min-max">
            <Card title="Orders Min/Max Value" sectioned>
              <div style={{ height: "300px" }}>
                <Line
                  data={chart_data_orders_min_max}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      x: {
                        type: "time",
                        time: {
                          unit: "day",
                          stepSize: 1
                        }
                      }
                    }
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
  const ordersRes = await fetch(
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
  const ordersResJson = await ordersRes.json();
  await new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });
  const min_max = CommonHelper.getFirstAndLastDate(ordersResJson.orders);
  return {
    originalOrders: ordersResJson.orders,
    minMax: min_max,
  };
};
