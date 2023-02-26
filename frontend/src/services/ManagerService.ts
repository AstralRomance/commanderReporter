import { ApiCaller } from '../utils/ApiCaller';
import { qParam, Service } from './Service';
import type { AxiosRequestConfig } from 'axios';

import type { IManagerService } from './ManagerService.types';
export * from './ManagerService.types';

export class ManagerService implements Service {
  public static getEvents(params?: AxiosRequestConfig) {
    return new ApiCaller().get<IManagerService.IGetEvents.Response>('/events/all-events', params);
  }
  public static postChangeEvent(eventId: qParam, params?: AxiosRequestConfig) {
    const searchParams = new URLSearchParams('target_state=Started');
    return new ApiCaller().post<IManagerService.IGetEvents.Response>(`/event-manager/change-event-state/${eventId}?${searchParams.toString()}`, {}, params);
  }
  public static postEvent(body: IManagerService.IPostEvent.Body, params?: AxiosRequestConfig) {
    return new ApiCaller().post<IManagerService.IPostEvent.Response>('/events/add-event', body, params);
  }
  public static deletePlayer(eventId: qParam, playerId: qParam, params?: AxiosRequestConfig) {
    return new ApiCaller().delete<IManagerService.IAddPlayer.Response>(`/event-manager/remove-player/${eventId}/${playerId}`, params);
  }
  public static addPlayer(eventId: qParam, body: IManagerService.IAddPlayer.Body, params?: AxiosRequestConfig) {
    return new ApiCaller().post<IManagerService.IDeletePlayer.Response>(`/event-manager/add-player/${eventId}`, body, params);
  }
  public static getEventPlayers(eventId: qParam, params?: AxiosRequestConfig) {
    return new ApiCaller().get<IManagerService.IGetEventPlayers.Response>(`/players/players_on_event/${eventId}`, params)
  }
}
