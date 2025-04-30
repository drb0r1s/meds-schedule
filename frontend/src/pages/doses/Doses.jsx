import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router";
import "./Doses.css";
import Loading from "../../components/loading/Loading";
import { DB } from "../../functions/DB";

const Doses = () => {
    const { doses } = useParams();
    const location = useLocation();

    const [schedule, setSchedule] = useState({});
    const [isLoading, setIsLoading] = useState(true);

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
    
    return(
        <section className="doses">
            {isLoading ? <Loading /> : <>
                <h2>{schedule.name}</h2>
            </>}
        </section>
    );
}

export default Doses;