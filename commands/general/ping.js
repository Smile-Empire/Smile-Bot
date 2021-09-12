const { MessageEmbed } = require('discord.js')

module.exports = {
  name: 'ping',
  description: 'Botの応答速度を計測します。',
  category: '一般',
  cooldown: 5,
  execute(message, client) {
    message.reply({
      embeds: [
        new MessageEmbed()
          .setTitle(':ping_pong: Pong!')
          .setDescription(
            `往復: ${message.createdTimestamp - Date.now()}ms\nGateway: ${
              client.ws.ping
            }ms`,
          )
          .defaultColor(),
      ],
    })
  },
}
