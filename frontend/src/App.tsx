import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Root } from "routes";

import { EventsPage, CreateEventPage } from "pages";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/events",
        element: <EventsPage />,
      },
      {
        path: "/create-event",
        element: <CreateEventPage />,
      },
    ],
  },
]);

/*  <Router>
    <Routes>
      <Route exact path="/events" element={<EventCard />} />
      <Route
        exact
        path={"event/:target_event_id"}
        element={<EventInfo />}
      />
      <Route exact path="/create-event" element={<CreateEvent />} />
      <Route path="/" element={<Navigate replace to="/events" />} />
    </Routes>
  </Router> */

function App() {
  return <RouterProvider router={router} />;
}

export default App;
