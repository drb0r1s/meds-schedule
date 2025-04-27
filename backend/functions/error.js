function error(res, props) {
    const errorStatus = props.errorStatus ? props.errorStatus : 400;
    res.status(errorStatus).json({ error: props.message });

    return { message: props.message };
}

module.exports = error;