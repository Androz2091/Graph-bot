const Discord = require('discord.js')
const config = require('../config.json')

module.exports = {
    run: (db, message, args, client, dbLogs) => {
        const numcmd = args[0]
        const guild = message.guild.name
        if (dbLogs.has('channelcmd_' + message.guild.id)) {
            if (dbLogs.has('catcmd_' + message.guild.id)) {
                // vérification que le salon stockée dans la base de données est valide
                const channelID = dbLogs.get('channelcmd_' + message.guild.id)
                const guildchannels = message.guild.channels.cache.map(channel => channel.id)
                if (guildchannels.includes(channelID)) {
                // vérification que le salon stockée dans la base de données est valide

                    // vérification que la catégorie stockée dans la base de données est valide
                    const guildparents = message.guild.channels.cache
                    const categoriestout = guildparents.filter((salon) => salon.type === 'category')
                    const categoriesId = categoriestout.map(categorie => categorie.id)
                    const dbcatcmd = dbLogs.get('catcmd_' + message.guild.id)
                    if (categoriesId.includes(dbcatcmd)) {
                    // vérification que la catégorie stockée dans la base de données est valide

                        if (numcmd < 6) {
                            const channelCMD = dbLogs.get('channelcmd_' + message.guild.id)
                            client.channels.cache.get(channelCMD).send({
                                embed: new Discord.MessageEmbed()
                                    .setTitle(message.author.id)
                                    .setDescription('Commande numéro : [' + numcmd + ']\nUtilisateur : ' + message.author.tag + ' (' + message.author.id + ')')
                                    .setColor('#E4534E')
                                    .setFooter(config.version, message.client.user.avatarURL())
                            }).then(msg => {
                                msg.react('✅')
                            })
                            message.channel.send(new Discord.MessageEmbed()
                                .setTitle('✅ Commande enregistré ✅')
                                .setDescription('Aller dans les messages privées de Graph Bot pour avoir tout les détails sur votre  📩 commande 📩 !')
                                .setColor('00FF00')
                                .setFooter(config.version, message.client.user.avatarURL()))
                            message.author.createDM().then(channel => {
                                channel.send(new Discord.MessageEmbed()
                                    .setTitle('✅ Commande enregistré ✅')
                                    .setDescription(`Votre commande au numéro \`${numcmd}\` sur le serveur ${guild} a bien été prise en compte, vous serez notifiée 🔽 ici 🔽 lorsqu'un graphiste vous auras pris en charge !`)
                                    .setColor('00FF00')
                                    .setFooter(config.version, message.client.user.avatarURL()))
                            })
                        } else {
                            message.channel.send(new Discord.MessageEmbed()
                                .setDescription('Le numéro d\'une commande doit être compris entre `1` et `5`, mais pas `' + numcmd + '` !')
                                .setColor('FF0000')
                                .setFooter(config.version, message.client.user.avatarURL()))
                        }
                    } else {
                        message.channel.send(new Discord.MessageEmbed()
                            .setDescription('⚠️ La catégorie stockée dans la base de données pour afficher les commandes est invalide ! ⚠️')
                            .setColor('FF0000')
                            .setFooter(config.version, message.client.user.avatarURL()))
                    }
                } else {
                    message.channel.send(new Discord.MessageEmbed()
                        .setDescription('⚠️ Le salon stockée dans la base de données pour afficher les commandes est invalide ! ⚠️')
                        .setColor('FF0000')
                        .setFooter(config.version, message.client.user.avatarURL()))
                }
            } else {
                message.channel.send(new Discord.MessageEmbed()
                    .setDescription('⚠️ Le gérant du serveur n\'a pas sélectionné la catégorie ou créé les tickets de commandes ! ⚠️')
                    .setColor('FF0000')
                    .setFooter(config.version, message.client.user.avatarURL()))
            }
        } else {
            message.channel.send(new Discord.MessageEmbed()
                .setDescription('⚠️ Le gérant du serveur n\'a pas sélectionné le salon ou afficher les commandes ! ⚠️')
                .setColor('FF0000')
                .setFooter(config.version, message.client.user.avatarURL()))
        }
    }
}
