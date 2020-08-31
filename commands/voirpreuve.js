const Discord = require('discord.js')
const config = require('C:/Users/matte/montage_video/bot/Graph-bot/config.json')

module.exports = {
    run: (db, message, args) => {
        const user = message.mentions.users.first()
        if (message.mentions.users.size === 1) {
            if (db.has('pr_' + user.id)) {
                var preuves = db.get('pr_' + user.id)
                var text = preuves.map((crea) => 'Preuve pour la création numéro ' + crea.id + '\n' + crea.url + '\n')
                message.channel.send({
                    embed: new Discord.MessageEmbed()
                        .setDescription(text)
                        .setColor('#FF0000')
                        .setFooter(config.version, 'https://cdn.discordapp.com/attachments/577866353030201355/749204835982770206/logo2_8.png'),
                    files: preuves.map((crea) => {
                        return {
                            name: crea.id + '.png',
                            attachment: crea.url
                        }
                    })
                })
            } else {
                message.channel.send(new Discord.MessageEmbed()
                    .setDescription('⚠️ Ce membre n\'est pas enregistré dans la base de donnée ! ⚠️')
                    .setColor('#FF0000')
                    .setFooter(config.version, 'https://cdn.discordapp.com/attachments/577866353030201355/749204835982770206/logo2_8.png'))
            }
        } else {
            if (db.has('pr_' + message.author.id)) {
                var preuve2 = db.get('pr_' + message.author.id)
                var text2 = preuve2.map((crea) => 'Preuve pour la création numéro ' + crea.id + '\n' + crea.url + '\n')
                message.channel.send({
                    embed: new Discord.MessageEmbed()
                        .setDescription(text2)
                        .setColor('#FF0000')
                        .setFooter(config.version, 'https://cdn.discordapp.com/attachments/577866353030201355/749204835982770206/logo2_8.png'),
                    files: preuve2.map((crea) => {
                        return {
                            name: crea.id + '.png',
                            attachment: crea.url
                        }
                    })
                })
            } else {
                message.channel.send(new Discord.MessageEmbed()
                    .setDescription('⚠️ Vous n\'êtes pas enregistré dans la base de donnée ! ⚠️')
                    .setColor('#FF0000')
                    .setFooter(config.version, 'https://cdn.discordapp.com/attachments/577866353030201355/749204835982770206/logo2_8.png'))
            }
        }
    }

}
