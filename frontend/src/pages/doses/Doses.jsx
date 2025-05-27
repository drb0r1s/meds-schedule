import React, { useState, useEffect, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router";
import "./Doses.css";
import DosesCreate from "./dosesCreate/DosesCreate";
import DosesTimeslot from "./dosesTimeslot/DosesTimeslot";
import DosesSchedule from "./dosesSchedule/DosesSchedule";
import Loading from "../../components/loading/Loading";
import Info from "../../components/Info/Info";
import Calendar from "../../components/calendar/Calendar";
import { DB } from "../../functions/DB";
import { ExtendedString } from "../../functions/ExtendedString";
import { images } from "../../data/images";

const Doses = () => {
    const { doses: dosesURL } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const [account, setAccount] = useState({});
    const [schedule, setSchedule] = useState({});
    const [doses, setDoses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [dosesLoading, setDosesLoading] = useState(true);
    const [weekDistance, setWeekDistance] = useState(0);
    const [modals, setModals] = useState({ create: false, timeslot: false, schedule: false });
    const [info, setInfo] = useState({ type: "", message: "" });
    const [dosesMatrix, setDosesMatrix] = useState(Array.from({ length: 24 }, () => Array.from({ length: 7 }, () => [])));

    const dosesCreateModalRef = useRef(null);
    const dosesTimeslotModalRef = useRef(null);
    const dosesScheduleModalRef = useRef(null);
    const calendarTimeslotsRef = useRef(null);

    const scheduleId = dosesURL.split("-")[dosesURL.split("-").length - 1];

    useEffect(() => {
        if(location.state?.schedule) {
            setAccount(location.state.account);
            setSchedule(location.state.schedule);
            setIsLoading(false);
        }

        else {
            const getAccount = async () => {
                const result = await DB.account.loggedIn();
                if(result.message) return;

                setAccount(result);
            }
            
            const getSchedule = async () => {
                const result = await DB.schedule.get(scheduleId);
                if(result.message) return;

                setSchedule(result);
                setIsLoading(false);
            }

            getAccount();
            getSchedule();
        }
    }, []);

    useEffect(() => {
        if(!Object.keys(schedule).length) return;

        const getDoses = async () => {
            const result = await DB.schedule.getDoses(schedule.id);
            if(result.message) return;

            setDoses(result);
            setDosesLoading(false);
        }

        getDoses();
    }, [schedule]);

    useEffect(() => {
        if(modals.create) setTimeout(() => { if(dosesCreateModalRef.current) dosesCreateModalRef.current.id = "doses-create-active" }, 10);
    }, [modals.create]);

    useEffect(() => {
        if(modals.timeslot) setTimeout(() => { if(dosesTimeslotModalRef.current) dosesTimeslotModalRef.current.id = "doses-timeslot-active" }, 10);
    }, [modals.timeslot]);

    useEffect(() => {
        if(modals.schedule) setTimeout(() => { if(dosesScheduleModalRef.current) dosesScheduleModalRef.current.id = "doses-schedule-active" }, 10);
    }, [modals.schedule]);

    function disableDosesCreateModal() {
        if(!dosesCreateModalRef.current) return;
        
        dosesCreateModalRef.current.id = "";
        setTimeout(() => setModals({...modals, create: false}), 300);
    }

    function disableDosesTimeslotModal() {
        if(!dosesTimeslotModalRef.current) return;
        
        dosesTimeslotModalRef.current.id = "";
        setTimeout(() => setModals({...modals, timeslot: false}), 300);
    }

    function disableDosesScheduleModal() {
        if(!dosesScheduleModalRef.current) return;
        
        dosesScheduleModalRef.current.id = "";
        setTimeout(() => setModals({...modals, schedule: false}), 300);
    }

    function getWeek(distance) {
        // 1000ms -> 60s -> 60m -> 24h -> 7 days
        const distancedWeek = distance * (1000 * 60 * 60 * 24 * 7);

        return new Date().getTime() + distancedWeek;
    }

    function switchCalendarPage(direction) {
        if(!calendarTimeslotsRef.current) return;

        calendarTimeslotsRef.current.style.top = direction === "next" ? "30px" : "-30px";
        calendarTimeslotsRef.current.style.opacity = "0";

        setTimeout(() => {
            if(!calendarTimeslotsRef.current) return;
            
            calendarTimeslotsRef.current.style.transition = "0";
            calendarTimeslotsRef.current.style.top = direction === "next" ? "-30px" : "30px";
            calendarTimeslotsRef.current.style.transition = "";

            if(direction === "prev") setWeekDistance(weekDistance - 1);
            else if(direction === "next") setWeekDistance(weekDistance + 1);

            setTimeout(() => {
                if(!calendarTimeslotsRef.current) return;
                
                calendarTimeslotsRef.current.style.top = "";
                calendarTimeslotsRef.current.style.opacity = "";
            }, 100);
        }, 200);
    }

    return(
        <section className="doses">
            {isLoading ? <Loading /> : <>
                {modals.create && <DosesCreate
                    schedule={schedule}
                    dosesCreateModalRef={dosesCreateModalRef}
                    disableDosesCreateModal={disableDosesCreateModal}
                    info={info}
                    setInfo={setInfo}
                    setDoses={setDoses}
                />}

                {modals.timeslot && <DosesTimeslot
                    account={account}
                    schedule={schedule}
                    timeslot={modals.timeslot}
                    dosesTimeslotModalRef={dosesTimeslotModalRef}
                    disableDosesTimeslotModal={disableDosesTimeslotModal}
                    setDoses={setDoses}
                    dosesMatrix={dosesMatrix}
                />}

                {modals.schedule && <DosesSchedule
                    account={account}
                    schedule={schedule}
                    setSchedule={setSchedule}
                    dosesScheduleModalRef={dosesScheduleModalRef}
                    disableDosesScheduleModal={disableDosesScheduleModal}
                    setInfo={setInfo}
                />}

                {info.message && <Info info={info} setInfo={setInfo} />}
                
                <div className="calendar-holder">
                    {dosesLoading && <Loading />}
                    
                    <Calendar
                        time={getWeek(weekDistance)}
                        doses={doses}
                        setModals={setModals}
                        setDosesMatrix={setDosesMatrix}
                        weekDistance={weekDistance}
                        calendarTimeslotsRef={calendarTimeslotsRef}
                    />
                </div>
                
                <div className="menu">
                    <h2 onClick={() => setModals({...modals, schedule: true})}>{ExtendedString.cutText(schedule.name, 10)}</h2>

                    <div className="center-group">
                        <button onClick={() => switchCalendarPage("prev")}><img src={images.arrowUpIcon} alt="UP" /></button>
                        <button onClick={() => setModals({...modals, create: true})}><img src={images.plusIcon} alt="CREATE" /></button>
                        <button onClick={() => switchCalendarPage("next")}><img src={images.arrowDownIcon} alt="DOWN" /></button>
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