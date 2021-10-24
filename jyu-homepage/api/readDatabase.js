module.exports = (req, res) => {
    res.json({
        body: req.body,
        query: req.query,
        cookies: req.cookies,
    });

    return(
        <>
            <div>
                "Hello world"
            </div>
            <div>
                {res}
            </div>
        </>
    )
};