import { memo, useCallback, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { IManagerService, IPlayer, ManagerService } from "services";

type TableColumnProps = {
  player: IPlayer;
  onDeletePlayer: (playerId) => void;
};
const TableColumn = memo<TableColumnProps>(({ player, onDeletePlayer }) => {
  return (
    <tr>
      <td>{player.Player_name}</td>
      <td>{player.Commander}</td>
      <td>{player.Deck_link}</td>
      <td>
        <button
          className="Delete_player btn waves-effect waves-light"
          type="button"
          onClick={() => onDeletePlayer(player.Player_id)}
        >
          Delete this player
        </button>
      </td>
    </tr>
  );
});

type TableColumnNewProps = {
  onAddPlayer: (player: IManagerService.IAddPlayer.Body) => void;
};
const TableColumnNew = ({ onAddPlayer }: TableColumnNewProps) => {
  const [playerNameValue, setPlayerNameValue] = useState("");
  const [commanderValue, setCommanderValue] = useState("");
  const [deckLinkValue, setDeckLinkValue] = useState("");

  const handleAddPlayer = () => {
    const player = {
      Player_name: playerNameValue,
      Commander: commanderValue,
      Deck_link: deckLinkValue,
    } as IManagerService.IAddPlayer.Body;

    setPlayerNameValue("");
    setCommanderValue("");
    setDeckLinkValue("");

    onAddPlayer(player);
  };

  return (
    <tr>
      <td>
        <div className="input-field">
          <input
            placeholder="Player name"
            name="player_name"
            value={playerNameValue}
            onChange={(e) => setPlayerNameValue(e.target.value)}
            id="player_name"
            type="text"
          />
        </div>
      </td>
      <td>
        <div className="input-field">
          <input
            placeholder="Commander"
            name="commander"
            value={commanderValue}
            onChange={(e) => setCommanderValue(e.target.value)}
            id="commander"
            type="text"
          />
        </div>
      </td>
      <td>
        <div className="input-field">
          <input
            placeholder="Deck link"
            name="deck_link"
            value={deckLinkValue}
            onChange={(e) => setDeckLinkValue(e.target.value)}
            id="deck_link"
            type="text"
          />
        </div>
      </td>
      <td>
        <button
          className="Add_player btn waves-effect waves-light"
          type="button"
          onClick={handleAddPlayer}
        >
          Add
        </button>
      </td>
    </tr>
  );
};

type TableProps = { eventId: string };
const Table = ({ eventId }: TableProps) => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState<IPlayer[]>([]);

  const onStartEvent = useCallback(async (id) => {
    try {
      const request = ManagerService.postChangeEvent(id);
      const response = await request.fetch();

      navigate("/events");
    } catch (error) {}
  }, []);

  const onAddPlayer = useCallback(async (eventId, player) => {
    try {
      const body = { ...player } as IManagerService.IAddPlayer.Body;
      const request = ManagerService.addPlayer(eventId, body);
      const response = await request.fetch();

      setPlayers((prevState) => [...prevState, response.data]);
    } catch (error) {}
  }, []);

  const onDeletePlayer = useCallback(async (eventId, playerId) => {
    try {
      const request = ManagerService.deletePlayer(eventId, playerId);
      const response = await request.fetch();

      setPlayers((prevState) =>
        [...prevState].filter((player) => player.Player_id !== playerId)
      );
    } catch (error) {}
  }, []);

  return (
    <section>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Commander</th>
            <th>Deck URL</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <TableColumn
              key={player.Player_id}
              player={player}
              onDeletePlayer={(playerId) => onDeletePlayer(eventId, playerId)}
            />
          ))}
          <TableColumnNew
            onAddPlayer={(player) => onAddPlayer(eventId, player)}
          />
        </tbody>
      </table>
      {players.length > 0 && (
        <div className="row">
          <button
            id="startButton"
            className="btn waves-effect waves-light-large col s1"
            onClick={() => onStartEvent(eventId)}
          >
            Start!
          </button>
        </div>
      )}
    </section>
  );
};

export default Table;
