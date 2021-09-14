const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Botの応答速度を計測します。'),
  async execute(interaction) {
    const start = Date.now()

    await interaction.deferReply()

    await interaction.editReply({
      embeds: [
        new MessageEmbed()
          .setTitle('🏓 Pong!')
          .setDescription(
            `Gateway: \`${Math.round(
              interaction.client.ws.ping,
            )}ms\`\n往復: \`${Date.now() - start}ms\``,
          )
          .defaultColor(),
      ],
    })
  },
}
