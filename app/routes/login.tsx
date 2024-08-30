import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import { commitSession, getSession } from "~/modules/session.server";
import { loginUserApi } from "~/modules/user.server";
import { redirect, json } from "@remix-run/node";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("cookie"));

  if (session.has("userId")) {
    return redirect("/newsletter");
  }
  return json(null);
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  const user = {
    email: (formData.get("email") as string) || "",
    password: (formData.get("password") as string) || "",
  };

  const serverResponse = await loginUserApi(user.email, user.password);

  console.log("🚀 ~ LoginRoute ~ serverResponse:", serverResponse);

  const session = await getSession(request.headers.get("cookie"));
  session.set("userId", serverResponse.data.user?.id || "");
  session.set("phone", serverResponse.data.user?.phone || "");
  session.set("tokens", {
    accessToken: serverResponse.data.session?.access_token || "",
    accessTokenExpiresIn: serverResponse.data.session?.expires_in || 0,
    refreshToken: serverResponse.data.session?.refresh_token || "",
  });

  return redirect("/newsletter", {
    headers: {
      "set-cookie": await commitSession(session),
    },
  });
};

export default function LoginRoute() {
  const actionData = useActionData<typeof action>();

  console.log("🚀 ~ LoginRoute ~ actionData:", actionData);

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Login to your account
            </h1>
            <Form className="space-y-4 md:space-y-6" method="post">
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Login
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                You do not have an account?{" "}
                <Link
                  to="/register"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Register here
                </Link>
              </p>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
}
