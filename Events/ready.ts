import * as Discord from "discord.js"
import * as ConfigFile from "../config"
const { client } = require("../index")

client.on("ready", () => {
    console.log("ready gamer")
    client.user.setActivity("for !help", {type: "WATCHING"});
})