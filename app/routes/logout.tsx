import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirectDocument, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { getSession, destroySession } from "~/modules/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("cookie"));
  // redirect to / if the user is not logged-in
  if (!session.has("userId")) {
    return redirect("/");
  }

  return json(null);
}

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get("cookie"));

  return redirectDocument("/", {
    headers: { "set-cookie": await destroySession(session) },
  });
}

export default function Component() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Form method="post">
        <h1 className="text-2xl mb-4">Are you sure, you want to log out?</h1>
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          type="submit"
        >
          Log out
        </button>
      </Form>
    </div>
  );
}
