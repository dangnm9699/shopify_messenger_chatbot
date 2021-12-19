import { Card, Navigation } from "@shopify/polaris";
import {
  CustomersMajor,
  OrdersMajor,
  QuickSaleMajor,
} from "@shopify/polaris-icons";

export default function Sidebar({ router, toggle }) {
  const checkIsSelected = function (path) {
    return router.pathname == path;
  };

  return (
    <Card>
      <Navigation location={router.pathname}>
        <Card sectioned >
          <Navigation.Section
            items={[
              {
                url: false,
                label: "Sales",
                matches: true,
                selected: checkIsSelected("/"),
                icon: QuickSaleMajor,
                onClick: () => toggle("/"),
              },
              {
                url: false,
                label: "Orders",
                matches: true,
                selected: checkIsSelected("/orders"),
                icon: OrdersMajor,
                onClick: () => toggle("/orders"),
              },
              {
                url: false,
                label: "Customers",
                matches: true,
                selected: checkIsSelected("/customers"),
                icon: CustomersMajor,
                onClick: () => toggle("/customers"),
              },
            ]}
            fill
          />
        </Card>
      </Navigation>
    </Card>
  );
}
