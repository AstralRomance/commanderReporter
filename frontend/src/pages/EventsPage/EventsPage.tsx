import { Col } from "components";
import { Card } from "./components";
import { useEvents } from "./hooks";

const EventsPage = () => {
  const { events, isLoading, error } = useEvents();

  if (isLoading) return <p>Пожалуйста, подождите...</p>;

  if (error) return <h2>Error {error.message}</h2>;

  return (
    <div className="container">
      <h1 style={{ textAlign: "center" }}>There is all events</h1>
      <div className="row">
        {events.map((event) => {
          return (
            <Col count={4} key={event.Event_id}>
              <Card event={event} />
            </Col>
          );
        })}
      </div>
    </div>
  );
};

export default EventsPage;
