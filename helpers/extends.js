const { Message, MessageEmbed } = require('discord.js')

Message.prototype.error = function (key, options = {}) {
  options.emoji = ':x:'
  options.msg = 'エラー'
  options.color = 'ED4245'
  return this.sendE(key, options)
}

Message.prototype.success = function (key, options = {}) {
  options.emoji = ':white_check_mark:'
  options.msg = '成功'
  options.color = '57F287'
  return this.sendE(key, options)
}

Message.prototype.sendE = function (key, options = {}) {
  const embed = new MessageEmbed()
    .setTitle(`${options.emoji} ${options.msg}`)
    .setDescription(key)
    .setColor(`#${options.color}`)

  if (options.edit) {
    return this.edit({ embeds: [embed] })
  } else {
    return this.reply({ embeds: [embed] })
  }
}

Message.prototype.sendT = function (key, options = {}) {
  if (options.edit) {
    return this.edit(key)
  } else {
    return this.channel.send(key)
  }
}

MessageEmbed.prototype.errorColor = function () {
  this.setColor('#ED4245')
  return this
}

MessageEmbed.prototype.successColor = function () {
  this.setColor('#57F287')
  return this
}

MessageEmbed.prototype.defaultColor = function () {
  this.setColor('#5865F2')
  return this
}
