import { Form, Link } from "@remix-run/react";

export default function Header() {
  return (
    <header className="flex flex-row justify-between w-full bg-slate-100 justify-center p-4">
      <ul className="flex flex-row gap-4">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/newsletter">Newsletter</Link>
        </li>
      </ul>

      <div>
        <Form className="flex flex-row gap-4">
          <button className="bg-slate-500" type="submit" name="lng" value="es">
            Español
          </button>
          <button className="bg-slate-500" type="submit" name="lng" value="en">
            English
          </button>
        </Form>
      </div>
    </header>
  );
}
