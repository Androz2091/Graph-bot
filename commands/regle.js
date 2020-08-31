const Discord = require('discord.js')
const config = require('../config.json')

module.exports = {
    run: (db, message) => {
        message.channel.send(new Discord.MessageEmbed()
            .setTitle('Règle 🔽')
            .setDescription('1 - Pour envoyer vos créations, tapez *creation puis entrez votre image. Le bot va alors vous confirmer que votre création est enregistrée dans la base de donnée. Veuillez réitérer cette opération pour chacune de vos créations !\n \n2 - Après avoir entré toutes vos créations, envoyez une ou plusieurs preuves pour chacune d\'elle. Une preuve peut-être un screen de votre logiciel avec votre création ouverte, ou l\'envoi direct d\'un fichier (Photoshop, ...) de votre création (pour les fichiers Photoshop, GIMP, etc... il est obligatoire que cela soit sous forme de lien. Vous pouvez par exemple créer un lien Mega, ou google drive). Si cela n\'est pas suffisant pour confirmer que c\'est bien vous qui avez les droits de la création, nous pourrons tout simplement refuser votre enregistrement pour la création concernée ! ⚠️ Avant d\'envoyer une preuve veuillez taper *preuve {le numéro de votre création} (si vous l\'avez envoyée en 1er, 2eme, etc...) et ensuite la preuve. Veuillez réitérer l\'opération pour chaque preuve ! ⚠️\n \nVous serez recontacté pour vous informer de la bonne ou mauvaise nouvelle pour l\'enregistrement de vos œuvres, Cela peut prendre 24h au maximum...')
            .setColor('#00FF00')
            .setFooter(config.version, message.client.user.avatarURL()))
    }

}
