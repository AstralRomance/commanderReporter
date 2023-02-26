import { useLeaders } from "../hooks";
import { useLocation } from 'react-router-dom';


const Leaderboard = () => {
    const eventUrl = useLocation();
    const eventId = eventUrl.pathname.split("/")[2];
    const { players } = useLeaders(eventId)
    console.log(`${eventId}`)
    return (<h3> Players would be here</h3>)
};

export default Leaderboard;