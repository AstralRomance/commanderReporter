import { memo } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

type ConfirmSectionProps = {
  eventNameValue: string;
  setEventNameValue: (prevState?) => void;
  startDate: any;
  handleStartDateChange: (prevState?) => void;
  onCreateEvent: (prevState) => void;
};
const ConfirmSection = memo<ConfirmSectionProps>(
  ({
    eventNameValue,
    setEventNameValue,
    startDate,
    handleStartDateChange,
    onCreateEvent,
  }) => {
    return (
      <div>
        <input
          name="Event_name"
          placeholder="Event name"
          value={eventNameValue}
          onChange={(e) => setEventNameValue(e.target.value)}
        />
        <DatePicker
          name="Event_Date"
          id="Event_Date"
          minDate={new Date()}
          selected={startDate}
          onChange={handleStartDateChange}
          dateFormat="dd MMMM, yyyy"
        />

        <button
          className="btn waves-effect waves-light"
          style={{ zIndex: 0 }}
          type="submit"
          id="EventCreate"
          onClick={onCreateEvent}
        >
          Create event
        </button>
      </div>
    );
  }
);

export default ConfirmSection;
