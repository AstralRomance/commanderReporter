import { memo } from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { IEvent } from "services";

type CardProps = { event: IEvent };
const Card = memo<CardProps>(({ event }) => {
  return (
    <div className="card blue-grey darken-1">
      <div className="card-content white-text">
        <span className="card-title">{event.Event_name}</span>
        <p>{dayjs(event.Event_Date).format("DD.MM.YYYY")}</p>
      </div>
      <div className="card-action">
        <Link to={`/event/${event.Event_id}`}>Go to event {">"}</Link>
      </div>
    </div>
  );
});

export default Card;
