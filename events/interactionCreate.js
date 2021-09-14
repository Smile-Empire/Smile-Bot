module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (!interaction.isCommand()) return

    const command = interaction.client.commands.get(interaction.commandName)

    if (!command) return

    const getUserData = () => {
      return new Promise((resolve) => {
        interaction.client.con.query(
          'SELECT * FROM `users` WHERE `userId` = ?',
          [interaction.user.id],
          (e, rows) => {
            if (!rows[0]) {
              interaction.client.con.query(
                'INSERT INTO `users` (`userId`) VALUES (?)',
                [interaction.user.id],
              )

              resolve({
                userId: interaction.user.id,
                moneyCount: 2,
              })
            } else {
              resolve(rows[0])
            }
          },
        )
      })
    }

    const userData = await getUserData()

    try {
      await command.execute(interaction, userData)
    } catch (error) {
      console.error(error)
      return interaction.reply({
        content: 'エラーが発生しました。',
        ephemeral: true,
      })
    }
  },
}
