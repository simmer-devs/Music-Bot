import * as Discord from "discord.js";
import {IBotCommand} from "../api";

export default class help implements IBotCommand{
    
    private readonly _command = "help"
    
    help(): string {
        return "This command does absolutely nothing! :-)"
    }    
    
    isThisCommand(command: string): boolean {
        return command === this._command;
    }
    
    async runCommand(args: string[], msgObject: Discord.Message, client: Discord.Client): Promise<void> {
        msgObject.delete()
        let state1 = new Discord.RichEmbed()
                .setTitle("**__Commands Help__**")
                .setURL("https://www.exaltedreputation.com")
                .setAuthor("ER Bot", client.user.avatarURL)
                .setColor("DARK_GOLD")
                .setDescription("This message gives a brief summary of the commands available with ER Bot. Please use the reactions below to view all of ER Bot's commands.")
                .setThumbnail(client.user.avatarURL)
                .setTimestamp()

        let state2 = new Discord.RichEmbed()
                .setColor("DARK_GOLD")
                .setDescription("TEST STATE 2")
                .setTimestamp()

        let state3 = new Discord.RichEmbed()
                .setColor("DARK_GOLD")
                .setDescription("TEST STATE 3")
                .setTimestamp()

        let state4 = new Discord.RichEmbed()
                .setColor("DARK_GOLD")
                .setDescription("TEST STATE 4")
                .setTimestamp()
                
                
                
                msgObject.channel.send(state1).then(async m => {
                    let message = m as Discord.Message
                    await message.react("◀")
                    await message.react("▶")
                    let state = 1
                    const filter = (reaction:Discord.MessageReaction, user:Discord.User) => (reaction.emoji.name == "◀" || reaction.emoji.name === "▶" && user.id === msgObject.author.id)
                    let results = message.createReactionCollector(filter)

                    results.on("collect", (res) => {
                        res.remove(msgObject.member.user)
                        if(res.emoji.name === "▶"){
                            if(state === 1){
                                message.edit(state2)
                                state++
                            }
                            else if(state === 2){
                                message.edit(state3)
                                state++
                            }
                            else if(state === 3){
                                message.edit(state4)
                                state++
                            }  
                        }
                        if(res.emoji.name === "◀"){
                            res.remove(msgObject.member.user)
                            if(state === 1){
                                return
                            }
                            else if(state === 2){
                                message.edit(state1)
                                state--
                            }
                            else if(state === 3){
                                message.edit(state2)
                                state--
                            }
                            else if(state === 4){
                                message.edit(state3)
                                state--
                            }
                        }
                    })   
                })
                
    }
}