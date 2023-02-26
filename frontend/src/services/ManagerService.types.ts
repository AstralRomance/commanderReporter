export interface IEvent {
  Event_Date: string;
  Event_id: string;
  Event_name: string;
}

export interface IPlayer {
  Player_id: string;
  Player_name: string;
  Commander: string;
  Deck_link: string;
}

export declare namespace IManagerService {
  namespace IGetEvents {
    type Response = IEvent;
  }
  namespace IPostEvent {
    type Body = { Event_name: string, Event_Date: string };
    type Response = any;
  }
  namespace IDeletePlayer {
    type Response = any;
  }
  namespace IAddPlayer {
    type Body = Omit<IPlayer, 'Player_id'>;
    type Response = any;
  }
}
