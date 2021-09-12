const { prefix } = require('../config.json')
const Discord = require('discord.js')

module.exports = {
  name: 'messageCreate',
  execute(message) {
    if (!message.content.startsWith(prefix) || message.author.bot) return

    const args = message.content.slice(prefix.length).trim().split(/ +/)
    const commandName = args.shift().toLowerCase()

    const command =
      message.client.commands.get(commandName) ||
      message.client.commands.find(
        (cmd) => cmd.aliases && cmd.aliases.includes(commandName),
      )

    if (!command) return

    if (command.guildOnly && !message.channel.type) {
      return message.error('このコマンドはサーバー内でしか使用できません。')
    }

    if (command.permissions) {
      const authorPerms = message.channel.permissionsFor(message.author)
      if (!authorPerms || !authorPerms.has(command.permissions)) {
        return message.reply('このコマンドを実行する権限がありません。')
      }
    }

    if (command.ownerOnly) {
      if (
        ![
          '723052392911863858',
          '878434901211361360',
          '744752301033521233',
        ].includes(message.author.id)
      ) {
        return message.error('このコマンドを実行する権限がありません。')
      }
    }

    const { cooldowns } = message.client

    if (!cooldowns.has(command.name)) {
      cooldowns.set(command.name, new Discord.Collection())
    }

    const now = Date.now()
    const timestamps = cooldowns.get(command.name)
    const cooldownAmount = (command.cooldown || 3) * 1000

    if (timestamps.has(message.author.id)) {
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount

      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000
        return message.error(
          `クールダウン中です。\nあと ${timeLeft.toFixed(
            1,
          )}秒 お待ちください。`,
        )
      }
    }

    timestamps.set(message.author.id, now)
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount)

    try {
      command.execute(message, message.client, args)
    } catch (error) {
      console.error(error)
      message.error(
        '原因不明のエラーが発生しました。\nサポートサーバーでお問い合わせください。',
      )
    }
  },
}