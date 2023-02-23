import { Link, Outlet } from "react-router-dom";

const Root = () => {
  return (
    <main className="background-red">
      <nav className="nav-wrapper">
        <ul id="nav-mobile" className="left hide-on-med-and-down">
          <li>
            <Link to="/events">Events</Link>
          </li>
          <li>
            <Link to="/create-event">New event</Link>
          </li>
        </ul>
      </nav>
      <Outlet />
    </main>
  );
};

export default Root;
