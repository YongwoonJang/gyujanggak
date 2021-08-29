export default function RequestFormAndResult(){
    
    const sendRequestData = async event => {
        event.preventDefault();
        let searchInput = document.getElementById("data").value;
        document.getElementById("result").innerHTML= searchInput;

    }
    return(
        <>
            <div id="result" />
            Hello
            <div>
                <form onSubmit={sendRequestData} >
                    <input id="data" name="data"/>
                    <button type="submit">Search</button>
                </form>
            </div>
        </>
    )
}