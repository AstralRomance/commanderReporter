import { IEvent, IManagerService, ManagerService } from 'services';
import { useState, useEffect, useRef } from "react";
import { ApiRequest } from 'utils/ApiRequest';

export const useEvents = () => {
  const request = useRef<ApiRequest<IManagerService.IGetEvents.Response>>();
  const [error, setError] = useState<null | any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    setIsLoading(true);

    (async () => {
      try {
        request.current = ManagerService.getEvents();
        const response = await request.current.fetch();

        setEvents(response.data as any);
        setIsLoading(false);
      } catch (error: any) {
        if (error?.code === "ERR_CANCELED") return;
        setError(error);
        setIsLoading(false);
      }

    })()

    return () => {
      if (request.current) request.current.abort();
    }
  }, []);

  return { error, isLoading, events }
}
