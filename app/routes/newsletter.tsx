import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, Link, useActionData, useNavigation } from "@remix-run/react";
import { useEffect, useRef } from "react";

import { getSession } from "~/modules/session.server";
import { redirect, json } from "@remix-run/node";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("cookie"));

  if (!session.has("userId")) {
    return redirect("/login");
  }
  return json(null);
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  const email = formData.get("email");

  await new Promise((resolve) => setTimeout(resolve, 1500));

  if (!email) {
    return {
      success: false,
      error: "Email is required",
      message: "Please provide an email address",
    };
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email as string)) {
    return {
      success: false,
      error: "Invalid email",
      message: "Please provide a valid email address",
    };
  }

  return {
    success: true,
    error: null,
    message: "You have successfully subscribed!",
  };
};

export default function NewsletterRoute() {
  const actionData = useActionData<typeof action>();

  const navigation = useNavigation();

  const state: "success" | "error" | "idle" | "submitting" =
    navigation.state === "submitting"
      ? "submitting"
      : actionData?.error
      ? "error"
      : actionData?.success
      ? "success"
      : "idle";

  const inputRef = useRef<HTMLInputElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);

  const mounted = useRef<boolean>(false);

  useEffect(() => {
    if (state === "error") {
      inputRef.current?.focus();
    }

    if (state === "idle" && mounted.current) {
      inputRef.current?.select();
    }

    if (state === "success") {
      successRef.current?.focus();
    }

    mounted.current = true;
  }, [state]);

  return (
    <main className="flex flex-col w-full h-lvh justify-center items-center bg-slate-100">
      <div className="w-[500px] bg-white p-16 rounded-lg">
        <Form
          replace
          method="post"
          className="w-full flex flex-col gap-4"
          aria-hidden={state === "success"}
        >
          <div className="text-center">
            <h1 className="text-3xl">Subscribe!</h1>
            <p className="text-sm">Do not miss any of the updates!</p>
          </div>
          <fieldset
            disabled={state === "submitting"}
            className="flex flex-row gap-2"
          >
            <input
              ref={inputRef}
              className="w-full p-2 border border-zinc-800 rounded-md h-11"
              type="string"
              name="email"
              placeholder="youremail@domain.com"
              required
              aria-label="Email address"
              aria-describedby="error-message"
            />
            <button
              className="bg-zinc-800 rounded-md text-white py-2 w-[240px] self-center h-11"
              type="submit"
            >
              {state === "submitting" ? "Subscribing..." : "Subscribe"}
            </button>
          </fieldset>

          <p id="error-message" className="text-sm text-red-400 text-center">
            {state === "error" ? actionData?.message : <>&nbsp;</>}
          </p>
        </Form>

        <div className="flex flex-col gap-3" aria-hidden={state !== "success"}>
          <div>
            <h2 ref={successRef} tabIndex={-1} className="text-2xl">
              You are subscribed!
            </h2>
            <p className="text-sm">
              Please check your email address to confirm your subscription
            </p>
          </div>
          <Link className="text-blue-600" to=".">
            Start over
          </Link>
        </div>
      </div>
    </main>
  );
}
