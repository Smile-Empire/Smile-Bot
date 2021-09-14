const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('wallet')
    .setDescription('ウォレットを確認します。(ユーザー指定もできます)')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('ウォレットを確認するユーザーを指定できます。'),
    ),
  async execute(interaction, userData) {
    await interaction.deferReply()

    if (interaction.options.getUser('user')) {
      interaction.client.con.query(
        'SELECT * FROM `users` WHERE `userId` = ?',
        [interaction.options.getUser('user').id],
        (e, rows) => {
          let mc
          if (!rows[0]) {
            mc = 2
          } else {
            mc = rows[0].moneyCount
          }

          const embed = new MessageEmbed()
            .setTitle(`${interaction.options.getUser('user').tag} さんの所持金`)
            .setDescription(`Esmile: ${mc}sm`)
            .defaultColor()
          interaction.editReply({
            embeds: [embed],
          })
        },
      )
    } else {
      const embed = new MessageEmbed()
        .setTitle(`${interaction.user.tag} さんの所持金`)
        .setDescription(`Esmile: ${userData.moneyCount}sm`)
        .defaultColor()
      interaction.editReply({
        embeds: [embed],
      })
    }
  },
}
