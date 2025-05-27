import React, { useState } from "react";
import "./SchedulesProfileAdmin.css";
import Checkbox from "../../../../components/checkbox/Checkbox";
import Loading from "../../../../components/loading/Loading";
import { DB } from "../../../../functions/DB";
import { images } from "../../../../data/images";

const SchedulesProfileAdmin = ({ account, setAccount, adminModalRef, disableAdminModal, setInfo }) => {
    const [adminPassword, setAdminPassword] = useState("");
    const [showAdminPassword, setShowAdminPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    async function handleContinue() {
        setIsLoading(true);
        const result = await DB.account.adminLogin(account.id, adminPassword);
        setIsLoading(false);

        if(result === null || result === undefined) return;

        if(result.message) {
            setInfo({ type: "error", message: result.message });
            return;
        }

        setInfo({ type: "success", message: "You're logged in as Administrator!" });

        setAccount({...account, admin: result.admin});
        disableAdminModal();
    }
    
    return(
        <div className="schedules-profile-admin" ref={adminModalRef}>
            {isLoading && <Loading />}
            
            <div
                className="x-button"
                onClick={disableAdminModal}
            ><img src={images.xIcon} alt="X" /></div>

            <h2>Admin Mode</h2>

            <form>
                <fieldset>
                    <input
                        type={showAdminPassword ? "text" : "password"}
                        placeholder="Admin password"
                        minLength="8"
                        maxLength="64"
                        value={adminPassword}
                        onChange={e => setAdminPassword(e.target.value)}
                    />

                    <Checkbox
                        title="Show admin password"
                        value={showAdminPassword}
                        setValue={setShowAdminPassword}
                        isChecked={showAdminPassword}
                    />
                </fieldset>
            </form>

            <div
                className="continue-button"
                onClick={handleContinue}
            >Continue</div>
        </div>
    );
}

export default SchedulesProfileAdmin;