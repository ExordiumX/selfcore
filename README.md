# Selfcore

Selfcore is a Discord API wrapper suitable for selfbots. It is designed to be minimal and easy to use, while being incredibly feature rich.

## Installation

Use either NPM or yarn to install selfcore.

```bash
npm i selfcore
```

## Usage

```javascript
import selfcore from 'selfcore'

const client = new Selfcore(TOKEN)
const gateway = new Selfcore.Gateway(TOKEN)

# Sends a message to specified channel ID
client.sendMessage(channel_id, 'Hello World!')

# Sends a message to a specified webhook. It takes either a string or a WebHook object with embeds.
client.sendWebhook(URL, content)

# Logs messages in realtime
gateway.on('message', (m) => {
    console.log(m.content)
})
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
