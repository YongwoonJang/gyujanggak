export default function Form() {
    const sendRequestData = async event => {
        event.preventDefault() // don't redirect page.

        const res = await fetch('/api/search/?q='+encodeURIComponent(event.target.data.value))
        const result = await res.json()
        console.log(result)
    }

    return (
        <form onSubmit={sendRequestData}>
            <input id="data" name="data" type="text" autoComplete="data" required />
            <button type="submit">검색</button>
        </form>
    )
}