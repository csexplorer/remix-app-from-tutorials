import { Link } from "@remix-run/react";

export default function Header() {
  return (
    <header className="flex flex-col w-full h-16 bg-slate-100 justify-center p-8">
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
    </header>
  );
}
