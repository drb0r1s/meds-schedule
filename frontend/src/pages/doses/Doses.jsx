import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router";
import "./Doses.css";
import Loading from "../../components/loading/Loading";
import Calendar from "../../components/calendar/Calendar";
import { DB } from "../../functions/DB";
import { images } from "../../data/images";

const Doses = () => {
    const { doses } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const [schedule, setSchedule] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [weekDistance, setWeekDistance] = useState(0);

    const scheduleId = doses.split("-")[doses.split("-").length - 1];

    useEffect(() => {
        if(location.state?.schedule) {
            setSchedule(location.state.schedule);
            setIsLoading(false);
        }

        else {
            const getSchedule = async () => {
                const result = await DB.schedule.get(scheduleId);
                
                if(result.message) return;

                setSchedule(result);
                setIsLoading(false);
            }

            getSchedule();
        }
    }, []);

    function getWeek(distance) {
        // 1000ms -> 60s -> 60m -> 24h -> 7 days
        const distancedWeek = distance * (1000 * 60 * 60 * 24 * 7);

        return new Date().getTime() + distancedWeek;
    }

    return(
        <section className="doses">
            {isLoading ? <Loading /> : <>
                <Calendar time={getWeek(weekDistance)} />
                
                <div className="menu">
                    <h2>{schedule.name}</h2>

                    <div className="center-group">
                        <button onClick={() => setWeekDistance(weekDistance - 1)}><img src={images.arrowUpIcon} alt="UP" /></button>
                        <button><img src={images.plusIcon} alt="CREATE" /></button>
                        <button onClick={() => setWeekDistance(weekDistance + 1)}><img src={images.arrowDownIcon} alt="DOWN" /></button>
                    </div>

                    <div className="right-group">
                        <button onClick={() => navigate("/schedules")}><img src={images.xIcon} alt="X" /></button>
                    </div>
                </div>
            </>}
        </section>
    );
}

export default Doses;