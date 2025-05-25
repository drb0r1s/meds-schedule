export function isAdmin(account) {
    if(account.type === "family" && account.admin) return true;
    if(account.type === "individual") return true;

    return false;
}