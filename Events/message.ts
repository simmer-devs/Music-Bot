import * as Discord from "discord.js"
import * as ConfigFile from "../config"
import { IBotCommand } from "../api";
const { client } = require("../index")

let cooldown = new Set();

export var commands: IBotCommand[] = [];
async function handleCommand(msg: Discord.Message){

    //split string into command and args

    let command = msg.content.split(" ")[0].replace(ConfigFile.config.prefix, "").toLowerCase();
    let args = msg.content.split(" ").slice(1);
    
    for(const commandClass of commands){
        //attempt to execute code with safety
        try{
            if(!commandClass.isThisCommand(command)){
                //go next iteration if this isnt the correct command
                continue;
            }
            await commandClass.runCommand(args, msg, client);
        }
        catch (exception){
            //if there is an error log exception
            console.log(exception);
        }
    }

}

function loadCommands(commandsPath: string){

    //exit if no commands
    if(!ConfigFile.config.commands || (ConfigFile.config.commands as string[]).length === 0) { return };

    //loop through commands in our config file
    for(const commandName of ConfigFile.config.commands as string[]){

        //Load the command class
        const commandsClass = require(`${commandsPath}/${commandName}`).default; 

        //cast as our custom IBotCommand interface
        const command = new commandsClass() as IBotCommand;

        //add to our commands list for later
        commands.push(command);
    }
}


loadCommands(`../Commands`)

client.on("message", (msg: Discord.Message) => {
    
    if(msg.author.bot) { return; }
    if(msg.channel.type == "dm") { return; }
    if(!msg.content.startsWith(ConfigFile.config.prefix)) {return;}

    if(cooldown.has(msg.author.id)){
        msg.delete()
        msg.reply("Please wait five seconds to use this command again.").then((m:any) => m.delete(5000))
    }
    else{
        cooldown.add(msg.author.id)
        handleCommand(msg)
    }

    setTimeout(() => {
        cooldown.delete(msg.author.id)
    }, 5000)

})