# How to get user input

## Desire

If I want to user input in index page then

## Requirements(Desire require)

1. Create input tag

2. Send text

3. Receive text

4. Receive result from elastic search

## Condition(Requirements should be containing)

- Input should send request data to elastic search server withoud not transfering to another screen(event.preventDefault())

```javascript
# This Code is not redirecting to another page.
function Form() {
    const send-request-data = async event => {
        event.preventDefault() // don't redirect page.

        const rest = await fetch('/api/search', {
            body: JSON.stringify({
                text: event.target.data.value
            }),
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'GET'
        })

        const result = await res.json()
        console.log(result)
    }

    return (
        <form onSubmit={send-request-data}>
            <label htmlFor="data">또롱</label>
            <input id="data" name="data" type="text" autoComplete="data" required />
            <button type="submit">검색</button>
        </form>
    )
}
```

- Receive data from itself

```javascript
export default function handler(req, res){
    res.status(200).json({ data: 'Thank you for your interest...'})
}
```

## function document reference 

- [Next.js link](https://nextjs.org/blog/forms)