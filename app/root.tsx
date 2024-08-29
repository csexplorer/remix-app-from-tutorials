import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useFetchers,
  useLoaderData,
  useNavigation,
  useRouteLoaderData,
} from "@remix-run/react";
import "./tailwind.css";
import Header from "./components/header";
import i18nServer, { localeCookie } from "./modules/i18n.server";
import { useChangeLanguage } from "remix-i18next/react";
import { LinksFunction, LoaderFunctionArgs, json } from "@remix-run/node";
import { useEffect, useMemo } from "react";

import NProgress from "nprogress";

import nProgressStyles from "nprogress/nprogress.css?url";
// We'll configure the namespace to use here
export const handle = { i18n: ["translation"] };

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: nProgressStyles }];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const locale = await i18nServer.getLocale(request); // get the locale

  return json(
    { locale },
    {
      headers: {
        "Set-Cookie": await localeCookie.serialize(locale),
      },
    }
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const loaderData = useRouteLoaderData<typeof loader>("root");

  const navigation = useNavigation();

  const fetchers = useFetchers();

  /**
   * This gets the state of every fetcher active on the app and combine it with
   * the state of the global transition (Link and Form), then use them to
   * determine if the app is idle or if it's loading.
   * Here we consider both loading and submitting as loading.
   */
  const state = useMemo<"idle" | "loading">(
    function getGlobalState() {
      const states = [
        navigation.state,
        ...fetchers.map((fetcher) => fetcher.state),
      ];
      if (states.every((state) => state === "idle")) return "idle";
      return "loading";
    },
    [navigation.state, fetchers]
  );

  useEffect(() => {
    // and when it's something else it means it's either submitting a form or
    // waiting for the loaders of the next location so we start it
    if (state === "loading") NProgress.start();
    // when the state is idle then we can to complete the progress bar
    if (state === "idle") NProgress.done();
  }, [state]);

  return (
    <html lang={loaderData?.locale ?? "en"}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Header />
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const { locale } = useLoaderData<typeof loader>();

  useChangeLanguage(locale);
  return <Outlet />;
}
