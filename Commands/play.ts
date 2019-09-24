import * as Discord from "discord.js";
import {IBotCommand} from "../api";
import * as ytdl from "ytdl-core"
var servers = require("../index")

export default class play implements IBotCommand{
    
    private readonly _command = "play"
    
    help(): string {
        return "This command does absolutely nothing! :-)"
    }    
    
    isThisCommand(command: string): boolean {
        return command === this._command;
    }
    
    async runCommand(args: string[], msgObject: Discord.Message, client: Discord.Client): Promise<void> {
        msgObject.delete()

        if(args.length === 0) {
            msgObject.reply("please request a song with a YouTube URL.").then((m:any) => m.delete(4000))
            return;
         }
         
         let validate = ytdl.validateURL(args[0])
         if(!validate) { 
             msgObject.reply("that is not a valid YouTube URL.").then((m:any) => m.delete(4000))
             return;
         }

         if(!msgObject.member.voiceChannel){
             msgObject.reply("you must be in a Voice Channel to use the Music Bot.").then((m:any) => m.delete(4000))
             return;
         }

         if(!servers[msgObject.guild.id]){
             servers[msgObject.guild.id] = {
                 queue:[]
             }
         }

         let server = servers[msgObject.guild.id]

         server.queue.push(args[0])

         if(!msgObject.guild.voiceConnection){
             msgObject.member.voiceChannel.join().then(async function(connection){
                 await play(connection, msgObject)
             })
         }

         async function play(connection: any, msgObject: any) {
            var server = servers[msgObject.guild.id]

            server.dispatcher = await connection.playStream(ytdl(server.queue[0], {filter: "audioonly"}))

            server.queue.shift()

            server.dispatcher.on("end", function(){
                if(server.queue[0]){
                    play(connection, msgObject)
                }
                else{
                    connection.disconnect()
                }
            })
         }




    }   
}   