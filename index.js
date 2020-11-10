const Discord = require('discord.js')
const client = new Discord.Client({
    partials: ['MESSAGE', 'CHANNEL', 'REACTION']
})
const config = require('./config.json')
const fs = require('fs')
const Database = require('easy-json-database')
const db = new Database('./database.json')
const dbLogs = new Database('./database_logs.json')

client.login(config.token)
client.commands = new Discord.Collection()

// Système qui gère les commandes dans le dossier

fs.readdir('./commands', (err, files) => {
    if (err) throw err
    files.forEach(file => {
        if (!file.endsWith('.js')) return
        const command = require(`./commands/${file}`)
        client.commands.set(file.split('.')[0], command)
    })
})

// Système qui gère les commandes dans le dossier

// Système qui gère le jeu du bot

const statuses = [
    'MP le bot',
    'pour enregistrer des 🎨 créations 🎨 !'
]
let i = 5
setInterval(() => {
    client.user.setActivity(statuses[i], { type: 'PLAYING' })
    i = ++i % statuses.length
}, 20 * 1000)

// Système qui gère le jeu du bot

// Système qui dirige les commandes tapées

client.on('message', message => {
    if (message.type !== 'DEFAULT' || message.author.bot) return
    if (message.content.startsWith(config.prefix + 'cmd') || message.content.startsWith(config.prefix + 'level') || message.content.startsWith(config.prefix + 'validcrea') || message.content.startsWith(config.prefix + 'setparentcmd') || message.content.startsWith(config.prefix + 'setchannelcmd')) {
        if (message.channel.type === 'dm') {
            return message.channel.send(new Discord.MessageEmbed()
                .setDescription('⚠️ Cette commande doit être tapée sur un serveur obligatoirement ⚠️')
                .setColor('#00FF00')
                .setFooter(config.version, message.client.user.avatarURL()))
        }
    }
    if (message.content.startsWith(config.prefix + 'viewpreuve') || message.content.startsWith(config.prefix + 'addpreuve')) {
        if (message.channel.type !== 'dm') {
            return message.channel.send(new Discord.MessageEmbed()
                .setDescription('⚠️ Cette commande doit être tapée dans le salon MP de Graph Bot obligatoirement ⚠️')
                .setColor('#00FF00')
                .setFooter(config.version, message.client.user.avatarURL()))
        }
    }
    const args = message.content.trim().split(/ +/g)
    const commandName = args.shift().toLowerCase()
    if (!commandName.startsWith(config.prefix)) return
    const command = client.commands.get(commandName.slice(config.prefix.length))
    if (!command) return
    command.run(db, message, args, client, dbLogs)
    dbLogs.push('logs', {
        date: Date.now(),
        cmd: commandName,
        userId: message.author.id
    })
})

// Système qui dirige les commandes tapées

// Système qui envoie un message quand le bot est ajouté sur un serveur

client.on('guildCreate', (guild) => {
    const channelInvite = guild.channels.cache.filter((channel) => channel.type !== 'category').first()
    channelInvite.createInvite({
        maxAge: 0
    }).then(invite => {
        client.channels.cache.get('764869622541189173').send(`Le bot est sur le serveur ${guild.name}, avec ${guild.memberCount} membres ! **❤️Merci❤️**\n\nInvitation : https://discord.gg/` + invite.code)
    })
    dbLogs.push('guild', {
        date: Date.now(),
        guild: guild.name
    })
})

// Système qui envoie un message quand le bot est ajouté sur un serveur

// Système qui gère la création des tickets pour le système de commande

client.on('messageReactionAdd', async (reaction, user) => {
    if (!user.bot) {
    } else { return }
    await reaction.fetch()
    if (reaction.emoji.name === '✅' && reaction.message.content.startsWith('Preuve') && reaction.message.author.id === '764867987291111506') {
        if (dbLogs.has('catcmd_' + reaction.message.guild.id)) {
            const catticketcmd = dbLogs.get('catcmd_' + reaction.message.guild.id)
            const description = reaction.message.embeds[0].description
            const userID = description.substring(
                description.lastIndexOf('(') + 1,
                description.lastIndexOf(')')
            )
            const commandID = description.substring(
                description.lastIndexOf('[') + 1,
                description.lastIndexOf(']')
            )
            const guild = reaction.message.guild
            reaction.message.guild.channels.create('ticket-' + userID, {
                parent: catticketcmd,
                permissionOverwrites: [
                    {
                        id: reaction.message.guild.id,
                        deny: [
                            'VIEW_CHANNEL'
                        ]
                    },
                    {
                        id: user.id,
                        allow: [
                            'VIEW_CHANNEL'
                        ]
                    },
                    {
                        id: userID,
                        allow: [
                            'VIEW_CHANNEL'
                        ]
                    }
                ]
            }).then((channel) => {
                channel.send('<@' + userID + '>')
                channel.send(new Discord.MessageEmbed()
                    .setTitle('🔽 Comment passer commande ? 🔽')
                    .setDescription('client : (' + userID + ') / graphiste : +' + user.id + '+ \n\nMerci d\'avoir créé un ticket de commande sur ' + guild.name + ' ! Veuillez maintenant décrire précisément votre commande !\n\nPour fermer le ticket cliquer sur la réaction 🔒 (seul le graphiste peut supprimer le ticket) !')
                    .setColor('#00FF00')
                    .setFooter(config.version, client.user.avatarURL())).then(msg => {
                    msg.react('🔒')
                })
            })

            client.users.cache.get(userID).send(new Discord.MessageEmbed()
                .setTitle('🎉 Bonne nouvelle 🎉')
                .setDescription('Un graphiste a accepté votre commande au numéro `' + commandID + '` sur le serveur ' + guild.name + ', un ticket vous a été créé !')
                .setColor('#00FF00')
                .setFooter(config.version, client.user.avatarURL()))
            client.channels.cache.get('766934052174430218').send('ticket de commande numéro : `' + commandID + '` créé pour l\'utilisateur : (`' + userID + '`)')
            dbLogs.push('cmd', {
                date: Date.now(),
                cmd: commandID,
                userId: userID,
                guild: guild.id
            })
            reaction.message.delete()
        }
    }
})

// Système qui gère la création des tickets pour le système de commande

// Système qui gère la fermeture des tickets pour le système de commande

client.on('messageReactionAdd', async (reaction, user) => {
    if (!user.bot) {
    } else { return }
    await reaction.fetch()
    if (reaction.message.channel.name.startsWith('ticket-')) {
        if (reaction.emoji.name === '🔒' && reaction.message.author.id === '764867987291111506') {
            const description = reaction.message.embeds[0].description
            const graphisteID = description.substring(
                description.indexOf('+') + 1,
                description.lastIndexOf('+')
            )
            if (user.id === graphisteID) {
                reaction.message.channel.delete()
            }
        }
    }
})

// Système qui gère la fermeture des tickets pour le système de commande

// Système qui gère la validation des créations

client.on('messageReactionAdd', async (reaction, user) => {
    if (user.bot) {
        return
    }
    await reaction.fetch()
    if (reaction.message.channel.id === '775274490723827715') {
        const description = reaction.message.embeds[0].description
        const userID = description.substring(
            description.lastIndexOf('(') + 1,
            description.lastIndexOf(')')
        )
        const creationID = description.substring(
            description.lastIndexOf('[') + 1,
            description.lastIndexOf(']')
        )
        const lienpreuveID = description.substring(
            description.indexOf('-') + 1,
            description.lastIndexOf('-')
        )
        if (reaction.emoji.name === '✅') {
            const creations = db.get(userID)
            creations.find((creation) => creation.id === parseInt(creationID)).verif = '✅'
            db.set(userID, creations)
            client.users.cache.get(userID).send(new Discord.MessageEmbed()
                .setTitle('🎉 Bonne nouvelle 🎉')
                .setDescription('Votre création à l\'id : `' + creationID + '` a été vérifié ! Taper `*viewcrea` pour voir votre nouvelle validation !')
                .setColor('#00FF00')
                .setFooter(config.version, client.user.avatarURL()))
            client.channels.cache.get('775411371189862410').send('Création numéro ' + creationID + ' de l\'utilisateur (`' + userID + '`) validée par ' + user.tag + ' (`' + user.id + '`) ')
        } else {
            client.users.cache.get(userID).send(new Discord.MessageEmbed()
                .setTitle('❌ Preuve invalide ❌')
                .setDescription('Votre preuve n\'a pas permi de confirmer que la création à l\'id : `' + creationID + '` vous appartenez ! Veuillez donc revoir vos preuves !')
                .setColor('#00FF00')
                .setFooter(config.version, client.user.avatarURL()))
            // ici on récupère toutes les preuves de l'utilisateur et on garde que celles ou preuve.url n'est pas égal à celle qu'on veut enlever
            const preuvedb = db.get('pr_' + userID).filter((preuve) => preuve.url !== lienpreuveID)
            // on met à jour la db
            db.set('pr_' + userID, preuvedb)
        }
        reaction.message.channel.messages.cache.filter(message => {
            const description2 = message.embeds[0].description
            const userID2 = description2.substring(
                description2.lastIndexOf('(') + 1,
                description2.lastIndexOf(')')
            )
            const creationID2 = description2.substring(
                description2.lastIndexOf('[') + 1,
                description2.lastIndexOf(']')
            )
            return userID2 === userID && creationID2 === creationID
        }).forEach(message => message.delete())
    }
})

// Système qui gère la validation des créations

// Système qui gère les sauvegardes de la base de données

const CronJob = require('cron').CronJob
const job = new CronJob('0 0 0 * * *', function () {
    const date = new Date()

    fs.writeFileSync('./backupdatabase/' + date.getDate() + '-' + (date.getMonth() + 1) + '.json', JSON.stringify(db.data, null, 2), 'utf-8')
}, null, true, 'Europe/Paris')
job.start()

// Système qui gère les sauvegardes de la base de données

// Système activé lors du démarrage du bot

client.on('ready', async () => {
    client.channels.cache.get('775274490723827715').messages.fetch()
    console.log('✅ bot connecté ✅')
})

// Système activé lors du démarrage du bot
