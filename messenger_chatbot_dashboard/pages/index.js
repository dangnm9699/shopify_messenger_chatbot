import { Badge, Card, DataTable, Link, Page, TextStyle } from "@shopify/polaris";
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
import DateChooser from "../components/DateChooser";

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

const CommonHelper = require("../helpers").CommonHelper;
const SaleHelper = require("../helpers").SaleHelper;

export default function Index({
  originalOrders,
  domain,
  minMax: { startDate, endDate, startMinus1Date, endPlus1Date },
  topByCollection,
  topByGender
}) {
  console.log("start date = ", startDate);
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
    datasets: [
      {
        data: productCountByDate.map((date) => {
          return {
            x: date.created_at,
            y: parseInt(date.quantity)
          }
        }),
        label: "Product Count",
        borderColor: "rgba(0, 128, 96, 1)",
        backgroundColor: "rgba(0, 128, 96, 1)",
        fill: false,
      },
    ],
  };

  const chart_data_revenue = {
    datasets: [
      {
        data: revenueByDate.map((date) => {
          return {
            x: date.created_at,
            y: parseFloat(date.revenue)
          }
        }),
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
        <div className="sale fullwidth">
          <div className="" style={{ width: "calc(60% - 1.5rem)" }}>
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
          <div className="" style={{ width: "calc(40% - 1.5rem)" }}>
            <Card title="TOP 5 products by units sold" sectioned>
              <DataTable
                columnContentTypes={["text", "numeric"]}
                headings={["Title", "Quantity"]}
                rows={rows}
              />
            </Card>
          </div>
        </div>
        <br />
        <div className="sale fullwidth tag">
          <div>
            <Card title="TOP 5 tags by Collection" sectioned>
              <Badge status="critical" size="medium">{topByCollection[0].tag}</Badge>
              <Badge status="warning" size="medium">{topByCollection[1].tag}</Badge>
              <Badge status="attention" size="medium">{topByCollection[2].tag}</Badge>
              <Badge status="success" size="medium">{topByCollection[3].tag}</Badge>
              <Badge status="info" size="medium">{topByCollection[4].tag}</Badge>
            </Card>
          </div>
          <div>
            <Card title="TOP 5 tags by Gender" sectioned>
              <Card.Section>
                <TextStyle variation="strong">{topByGender[0].gender}</TextStyle>
                <Badge status="critical" size="medium">{topByGender[0].product[0].tag}</Badge>
                <Badge status="warning" size="medium">{topByGender[0].product[1].tag}</Badge>
                <Badge status="attention" size="medium">{topByGender[0].product[2].tag}</Badge>
                <Badge status="success" size="medium">{topByGender[0].product[3].tag}</Badge>
                <Badge status="info" size="medium">{topByGender[0].product[4].tag}</Badge>
              </Card.Section>
              <br />
              <Card.Section>
                <TextStyle variation="strong">{topByGender[1].gender}</TextStyle>
                <Badge status="critical" size="medium">{topByGender[1].product[0].tag}</Badge>
                <Badge status="warning" size="medium">{topByGender[1].product[1].tag}</Badge>
                <Badge status="attention" size="medium">{topByGender[1].product[2].tag}</Badge>
                <Badge status="success" size="medium">{topByGender[1].product[3].tag}</Badge>
                <Badge status="info" size="medium">{topByGender[1].product[4].tag}</Badge>
              </Card.Section>
            </Card>
          </div>
        </div>
        <br />
        <div className="sale fullwidth">
          <div className="sale__volume">
            <Card title="Products Quantity" sectioned>
              <div style={{ height: "300px" }}>
                <Line
                  data={chart_data_sale}
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
          <div className="sale__revenue">
            <Card title="Revenue In" sectioned>
              <div style={{ height: "300px" }}>
                <Line
                  data={chart_data_revenue}
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
          <br />
        </div>
      </Page>
    </div>
  );
}

Index.getInitialProps = async (ctx) => {
  const shopRes = await fetch(
    process.env.NODE_ENV == "production"
      ? `${process.env.HOST}/shop-information`
      : "http://localhost:8081/shop-information",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const shopResJson = await shopRes.json();
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
  // const topByCollectionRes = await fetch(
  //   process.env.NODE_ENV == "production"
  //     ? `${process.env.ANALYZER_HOST}/api/chatlog/top-finding-collection`
  //     : "http://localhost:8080/api/chatlog/top-finding-collection",
  //   {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   }
  // );
  // const topByCollectionResJson = await topByCollectionRes.json();
  // const topByGenderRes = await fetch(
  //   process.env.NODE_ENV == "production"
  //     ? `${process.env.ANALYZER_HOST}/api/chatlog/top-finding-gender`
  //     : "http://localhost:8080/api/chatlog/top-finding-gender",
  //   {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   }
  // );
  // const topByGenderResJson = await topByGenderRes.json();
  const min_max = CommonHelper.getFirstAndLastDate(ordersResJson.orders);
  return {
    originalOrders: ordersResJson.orders,
    domain: shopResJson.shop.domain,
    minMax: min_max,
    topByCollection: [
      {
        "count": 4,
        "tag": "áo"
      },
      {
        "count": 3,
        "tag": "váy"
      },
      {
        "count": 3,
        "tag": "áo len"
      },
      {
        "count": 2,
        "tag": "quần"
      },
      {
        "count": 1,
        "tag": "giày"
      },
      {
        "count": 1,
        "tag": "chân váy"
      },
      {
        "count": 1,
        "tag": "quần jeans"
      },
      {
        "count": 1,
        "tag": "quần dài"
      },
      {
        "count": 1,
        "tag": "quần short"
      },
      {
        "count": 1,
        "tag": "áo sơ mi"
      },
      {
        "count": 1,
        "tag": "áo khoác"
      },
      {
        "count": 1,
        "tag": "áo thun"
      }
    ],
    topByGender: [
      {
        "gender": "nam",
        "product": [
          {
            "count": 1,
            "tag": "áo"
          },
          {
            "count": 1,
            "tag": "áo thun"
          },
          {
            "count": 0,
            "tag": "giày"
          },
          {
            "count": 0,
            "tag": "chân váy"
          },
          {
            "count": 0,
            "tag": "váy"
          },
          {
            "count": 0,
            "tag": "quần jeans"
          },
          {
            "count": 0,
            "tag": "quần dài"
          },
          {
            "count": 0,
            "tag": "quần short"
          },
          {
            "count": 0,
            "tag": "quần"
          },
          {
            "count": 0,
            "tag": "áo sơ mi"
          },
          {
            "count": 0,
            "tag": "áo len"
          },
          {
            "count": 0,
            "tag": "áo khoác"
          }
        ]
      },
      {
        "gender": "nữ",
        "product": [
          {
            "count": 1,
            "tag": "váy"
          },
          {
            "count": 1,
            "tag": "quần short"
          },
          {
            "count": 1,
            "tag": "quần"
          },
          {
            "count": 1,
            "tag": "áo"
          },
          {
            "count": 0,
            "tag": "giày"
          },
          {
            "count": 0,
            "tag": "chân váy"
          },
          {
            "count": 0,
            "tag": "quần jeans"
          },
          {
            "count": 0,
            "tag": "quần dài"
          },
          {
            "count": 0,
            "tag": "áo sơ mi"
          },
          {
            "count": 0,
            "tag": "áo len"
          },
          {
            "count": 0,
            "tag": "áo khoác"
          },
          {
            "count": 0,
            "tag": "áo thun"
          }
        ]
      }
    ]
  };
};
