// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');
//const { token } = require('./config.json');

//dotenv
const dotenv = require('dotenv')
dotenv.config()
const { TOKEN, CLIENT_ID, GUILD_ID} = process.env

// Importação dos comandos
const fs = require("node:fs")
const path = require("node:path")

const commandsPath = path.join(__dirname, "commands")
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"))

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection()

for(const file of commandFiles) {
	const filePath = path.join(commandsPath, file)
	const command = require(filePath)

	
	if("data" in command && "execute" in command) {
		client.commands.set(command.data.name, command)
	} else {
		console.log(`Esse comando em em ${filePath} está com "data" ou execute ausentes`)
	}

}

console.log(client.commands)

// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.

//Login do bot
client.once(Events.ClientReady, readyClient => { //
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// Log in to Discord with your client's token
client.login(TOKEN);

// Listener de interações com o bot
client.on(Events.InteractionCreate, async interaction => {
	if(interaction.isStringSelectMenu()){
		const selected = interaction.values[0]

		if (selected == "javascript"){
            await interaction.reply("Documentação do Javascript: https://developer.mozilla.org/en-US/docs/Web/JavaScript")
        } else if (selected == "python"){
            await interaction.reply("Documentação do Python: https://www.python.org")
        } else if (selected == "csharp"){
            await interaction.reply("Documentação do C#: https://learn.microsoft.com/en-us/dotnet/csharp/")
        } else if (selected == "discordjs"){
            await interaction.reply("Documentação do Discord.js: https://discordjs.guide/#before-you-begin")
        }


	}

	if(!interaction.isChatInputCommand()) return
	
	const command = interaction.client.commands.get(interaction.commandName)
	if(!command) {
		console.error("Comando não encontrado")
		return
	}
	try {
		await command.execute(interaction)
	}
	catch(error){
		console.error(error)
		await interaction.replay("Houve um erro ao executar esse comando")
	}
});