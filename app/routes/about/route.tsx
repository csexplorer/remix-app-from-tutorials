import { useLoaderData, useNavigation } from "@remix-run/react";
import { json } from "@remix-run/node";
export async function loader() {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return json({ company: { name: "Remix", url: "https://remix.run" } });
}

export default function NewsletterRoute() {
  const loaderData = useLoaderData<typeof loader>();

  const navigation = useNavigation();

  console.log({ navigation });
  return (
    <main>
      <section>
        <h2>About the company</h2>
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500">
            <tbody>
              <tr className="bg-white border">
                <th>Name</th>
                <td>{loaderData?.company?.name}</td>
              </tr>
              <tr className="bg-white border">
                <th>URL</th>
                <td>
                  <a href={loaderData?.company?.url}>
                    {loaderData?.company?.url}
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
