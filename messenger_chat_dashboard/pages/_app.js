import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import {
  AppProvider,
  Card,
  Frame,
  Layout,
  Loading,
  SkeletonBodyText,
  SkeletonDisplayText,
  SkeletonPage,
  Tabs,
  TextContainer,
} from "@shopify/polaris";
import { Provider, useAppBridge } from "@shopify/app-bridge-react";
import { authenticatedFetch } from "@shopify/app-bridge-utils";
import { Redirect } from "@shopify/app-bridge/actions";
import "@shopify/polaris/dist/styles.css";
import styles from "../styles/globals.css";
import translations from "@shopify/polaris/locales/en.json";
import { useRouter } from "next/dist/client/router";
import { useCallback, useEffect, useState } from "react";

function userLoggedInFetch(app) {
  const fetchFunction = authenticatedFetch(app);

  return async (uri, options) => {
    const response = await fetchFunction(uri, options);

    if (
      response.headers.get("X-Shopify-API-Request-Failure-Reauthorize") === "1"
    ) {
      const authUrlHeader = response.headers.get(
        "X-Shopify-API-Request-Failure-Reauthorize-Url"
      );

      const redirect = Redirect.create(app);
      redirect.dispatch(Redirect.Action.APP, authUrlHeader || `/auth`);
      return null;
    }

    return response;
  };
}

function MyProvider(props) {
  const app = useAppBridge();

  const client = new ApolloClient({
    fetch: userLoggedInFetch(app),
    fetchOptions: {
      credentials: "include",
    },
  });

  const Component = props.Component;

  return (
    <ApolloProvider client={client} style={{ height: "100%" }}>
      <div
        style={{
          display: "flex",
        }}
      >
        <Component {...props} />
      </div>
    </ApolloProvider>
  );
}

function MyApp({ Component, pageProps, host }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const loadingMarkup = isLoading ? <Loading /> : null;

  const actualPageMarkup = (
    <>
      <MyProvider Component={Component} {...pageProps} />
    </>
  );

  const loadingPageMarkup = (
    <SkeletonPage>
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <TextContainer>
              <SkeletonDisplayText size="small" />
              <SkeletonBodyText lines={9} />
            </TextContainer>
          </Card>
        </Layout.Section>
      </Layout>
    </SkeletonPage>
  );

  const pageMarkup = isLoading ? loadingPageMarkup : actualPageMarkup;

  const [selected, setSelected] = useState(0);

  const tabs = [
    {
      id: "sales",
      content: "Sales",
      accessibilityLabel: "Sales",
      panelID: "sales",
      path: "/",
    },
    {
      id: "orders",
      content: "Orders",
      accessibilityLabel: "Customers",
      panelID: "orders",
      path: "/orders",
    },
    {
      id: "customers",
      content: "Customers",
      accessibilityLabel: "Customers",
      panelID: "customers",
      path: "/customers",
    },
  ];

  const handleTabChange = useCallback((selectedTabIndex) => {
    setSelected(selectedTabIndex);
    router.push(tabs[selectedTabIndex].path);
  }, []);

  useEffect(() => {
    router.events.on("routeChangeStart", () => setIsLoading(true));
    router.events.on("routeChangeComplete", () => setIsLoading(false));
  }, [router]);

  return (
    <AppProvider i18n={translations}>
      <Provider
        config={{
          apiKey: API_KEY,
          host: host,
          forceRedirect: true,
        }}
      >
        <Frame>
          <Tabs
            tabs={tabs}
            selected={selected}
            onSelect={handleTabChange}
            fitted
          >
            {loadingMarkup}
          </Tabs>
          {pageMarkup}
        </Frame>
      </Provider>
    </AppProvider>
  );
}

MyApp.getInitialProps = async ({ ctx }) => {
  return {
    host: ctx.query.host,
  };
};

export default MyApp;
