import * as Discord from "discord.js"
import * as ConfigFile from "./config"
const fs = require("fs")

var servers = {};

//client setup
const client: Discord.Client = new Discord.Client();
client.login(ConfigFile.config.token)
module.exports = {
    client: client,
    object: servers
}

//event handler
fs.readdir("./Events/", (err:any, files:any) => {
    
    if(err) { return console.log(err) }

    let jsFiles = files.filter((f: any) => f.split(".").pop() === "js")
    if (jsFiles.length <= 0) return console.log("No events to load.")

    console.log(`Loading ${jsFiles.length} events...`)

    jsFiles.forEach((f: any, i: any) => {
        require(`./Events/${f}`)
        console.log(`${i + 1}: ${f} loaded!`)
    })  
})





