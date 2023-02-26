import { useState, useCallback } from "react";
import { IManagerService, ManagerService } from "services";

import { Table, ConfirmSection } from "./components";
import dayjs from "dayjs";

type Steps = "create" | "confirm";

const CreateEvent = () => {
  const [step, setStep] = useState<Steps>("create");
  const [event, setEvent] = useState<any>(null);
  const [startDate, setStartDate] = useState<string | any>(new Date());
  const [eventNameValue, setEventNameValue] = useState<string>("");

  const handleStartDateChange = useCallback((date) => {
    setStartDate(date);
  }, []);

  const onCreateEvent = useCallback(async () => {
    const body = {
      Event_name: eventNameValue,
      Event_Date: dayjs(startDate).format("DD MMMM, YYYY"),
    } as IManagerService.IPostEvent.Body;

    const request = ManagerService.postEvent(body);
    const response = await request.fetch();

    setEvent(response.data);
    setStep("confirm");
  }, [eventNameValue, startDate]);

  return (
    <main className="container">
      <h1 style={{ textAlign: "center" }}>New Event</h1>
      {step === "create" && (
        <ConfirmSection
          eventNameValue={eventNameValue}
          setEventNameValue={setEventNameValue}
          startDate={startDate}
          handleStartDateChange={handleStartDateChange}
          onCreateEvent={onCreateEvent}
        />
      )}
      {step === "confirm" && <Table eventId={event.Event_id} />}
    </main>
  );
};

export default CreateEvent;
