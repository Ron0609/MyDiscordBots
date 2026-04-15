const http = require('http');
const { Client, Intents } = require('discord.js');

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGES
  ]
});

const prefix = '.';
const selectedMembers = {};

// =========================
// 最小稳定 HTTP server（Render 用）
// =========================

const PORT = process.env.PORT || 3000;

http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('OK');
}).listen(PORT, () => {
  console.log("HTTP server running on port " + PORT);
});


// =========================
// Discord Bot
// =========================

client.once('ready', () => {
  console.log('Bot準備完了～');
});

client.on('messageCreate', async message => {

  if (!message.content || !message.content.trim()) {
    return;
  }

  if (message.author.bot) {
    return;
  }

  if (!message.content.startsWith(prefix)) {
    return;
  }

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  // =========================
  // start
  // =========================

  if (command === 'start') {

    const channelName = args[0];
    const name = args[1];

    if (!channelName) {
      return message.channel.send('チャンネル名を指定してください .start name');
    }

    const channel = message.guild.channels.cache.find(
      ch => ch.name === channelName
    );

    if (!channel) {
      return message.channel.send(`#${channelName} が見つかりません`);
    }

    if (selectedMembers[channel.id]) {
      return message.channel.send('このチャンネルですでに選ばれた人がいます！');
    }

    if (!channel.members.size) {
      await channel.members.fetch();
    }

    const member = channel.members.random();

    const msg = name
      ? `${name} に選ばれました！`
      : 'あなたが選ばれました！';

    member.send(msg)
      .then(() => {

        message.channel.send(
          `チャンネル\`${channelName}\`から１名選ばれました！`
        );

        selectedMembers[channel.id] = member;

      })
      .catch(error => {

        console.error(error);

        message.channel.send(
          `メッセージの送信に失敗しました`
        );

      });

  }

  // =========================
  // end
  // =========================

  if (command === 'end') {

    const selected = [];

    for (const channelId in selectedMembers) {

      const channel =
        message.guild.channels.cache.get(channelId);

      const member =
        selectedMembers[channelId];

      if (channel && member) {

        selected.push(
          `${channel.name}: ${member.user.tag}`
        );

      }

    }

    if (selected.length === 0) {
      return message.channel.send('まだ誰も選ばれていません！');
    }

    message.channel.send(
      `選択されたメンバー:\n${selected.join('\n')}`
    );

    Object.keys(selectedMembers).forEach(channelId => {
      delete selectedMembers[channelId];
    });

  }

  // =========================
  // restart
  // =========================

  if (command === 'restart') {

    message.channel.send('ボットを再起動します...');

    client.destroy();

    client.login(process.env.DISCORD_BOT_TOKEN);

  }

  // =========================
  // rule
  // =========================

  if (command === 'rule') {

    message.channel.send(`
1.ゲーム開始：
・各チームには1人のスパイがいます。
・\`${prefix}start チャンネル名\` を入力するとDMを送ります。

2.ゲーム進行：
・スパイは正体を隠します。
・他のプレイヤーはスパイを見つけます。

投票後：
\`${prefix}end\` を入力すると結果を表示します。
`);

  }

});


// =========================
// 登录（带日志）
// =========================

if (!process.env.DISCORD_BOT_TOKEN) {

  console.error("❌ DISCORD_BOT_TOKEN is missing!");

} else {

  console.log("✅ TOKEN found, trying to login...");

}

client.login(process.env.DISCORD_BOT_TOKEN)
  .then(() => console.log("✅ Discord login success"))
  .catch(err => console.error("❌ Discord login failed:", err));
