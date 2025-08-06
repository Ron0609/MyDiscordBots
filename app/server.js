const http = require('http');
const querystring = require('querystring');
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES] });
const prefix = '.';

const selectedMembers = {}; // 用于保存选中的成员，按照频道 ID 存储

http.createServer(function(req, res){
 if (req.method == 'POST'){
   var data = "";
   req.on('data', function(chunk){
     data += chunk;
   });
   req.on('end', function(){
     if(!data){
        console.log("No post data");
        res.end();
        return;
     }
     var dataObject = querystring.parse(data);
     console.log("post:" + dataObject.type);
     if(dataObject.type == "wake"){
       console.log("Woke up in post");
       res.end();
       return;
     }
     res.end();
   });
 }
 else if (req.method == 'GET'){
   res.writeHead(200, {'Content-Type': 'text/plain'});
   res.end('Discord Bot is active now\n');
 }
}).listen(3000);



client.once('ready', () => {
    console.log('Bot準備完了～');
});

client.on('messageCreate', async message => {
    // 检查消息内容是否为空或者只包含空白字符
    if (!message.content.trim()) {
        console.log('Received empty message or whitespace only message.');
        return;
    }
  
    // 如果消息是以提及机器人的形式开始的
    if (message.content.startsWith(`<@!${client.user.id}>`) || message.content.startsWith(`<@${client.user.id}>`)) {
        message.channel.send(`你好，私は小黒子です。 
        
        それぞれのチャンネルに分かれた後、以下のコマンドでSpyにDMを送ります。
        ※チャンネルにメンバーがいる状態で\`${prefix}start\`してください。
        ※チャンネルメンバー入れ替わるときは\`${prefix}restart\`でbotを再起動してください。
        
        ゲーム 開始：\`${prefix}start チャンネル名\` 
        ゲーム 終了：\`${prefix}end\` 
        botリセット：\`${prefix}restart\` 
        ルール 説明：\`${prefix}rule\`
        `
        );
        return;
    }
  
    console.log('Received message:', message.content); // 打印消息内容
    if (!message.content.startsWith(prefix) || message.author.bot) {
      console.log('Skipped message~'); // 打印跳过消息的信息
      return;
    }

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'start') {
        const channelName = args[0];
        const name = args[1]; // 获取第二个参数作为 name 变量的值

        if (!channelName) {
            return message.channel.send('チャンネル名を指定してください .start name');
        }

        
        const channel = message.guild.channels.cache.find(ch => ch.name === channelName);
        
        // 检查之前是否已经选中了频道成员
        if (selectedMembers[channel.id]) {
            return message.channel.send('このチャンネルですでに選ばれた人がいます！');
        }
      
        if (!channel) {
            return message.channel.send(`#${channelName} が見つかりません`);
        }

        // 检查是否有成员
        if (!channel.members.size) {
            try {
                await channel.members.fetch();
            } catch (error) {
                console.error('Error fetching guild members:', error);
                return message.channel.send('サーバーのメンバーを取得中にエラーが発生。メンバー確認後`.restart\`\してください。');
            }
        }

        const member = channel.members.random();
        const msg = name ? `${name} に選ばれました！` : 'あなたが選ばれました！';
        member.send(msg)
            .then(() => {
                console.log(`Sent message to ${member.user.tag}`);

                // 发送选中成员的信息后，通知所有频道成员已经选中
                if (!!member) {
                   message.channel.send(`チャンネル\`${channelName}\`から１名選ばれました！`); 
                  // 保存新选中的成员对象
                  selectedMembers[channel.id] = member;
                }
            })
            .catch(error => {
                console.error(`Could not send message to ${member.user.tag}.\n`, error);
                message.channel.send(`メッセージの送信に失敗しました: ${member.user.tag}`);
            });

    }


  
    if (command === 'end') {
      // 初始化一个空数组来存储选中的成员
      const selected = [];
      
      // 遍历所有已选中的频道
      for (const channelId in selectedMembers) {
          const channel = message.guild.channels.cache.get(channelId);
          // 检查频道是否存在
          if (channel) {
              // 获取频道的成员
              const member = selectedMembers[channelId];
              // 检查成员是否存在
              if (member) {
                  // 将频道名和成员信息拼接并添加到选中数组中
                  selected.push(`${channel.name}: ${member.user.tag}`);
              } else {
                  console.error(`Member object for channel ${channelId} is undefined.`);
              }
          } else {
              console.error(`Channel ${channelId} does not exist.`);
          }
      }
      
      // 判断是否存在选中的成员
      if (selected.length === 0) {
          return message.channel.send('まだ誰も選ばれていません！');
      }

      // 发送选中的成员信息
      message.channel.send(`選択されたメンバー:\n${selected.join('\n')}`);
      
      
      Object.keys(selectedMembers).forEach(channelId => {
          delete selectedMembers[channelId];
      });
      
    }
  
  
    if (command === 'restart') {
        // 重新启动机器人
        message.channel.send('ボットを再起動します...');
        client.destroy();
        client.login(process.env.DISCORD_BOT_TOKEN);
    }
  
    if (command === 'rule') {
        // 规则说明
       message.channel.send(`
       1.ゲーム開始： 
          ・各チームには1人のスパイがいます。
          ・\`${prefix}start チャンネル名\`を入力すると、小黑子はスパイにDMを送ります。
       2.ゲーム進行：
          ・スパイの役割は、自分の正体を隠しながらチームを負けさせることです。
          ・他のプレイヤーの役割は、ゲームに勝利し、スパイを見つけ出すことです。 
          
        　投票後、\`${prefix}end\`を入力すると、小黑子はスパイを公表します。
        `
        );
    }
  
});



client.on('voiceStateUpdate', (oldState, newState) => {
    const guild = oldState.guild;
    const newChannel = newState.channel;
  
    // 只处理加入新频道的情况
    if (oldState.channel === null && newChannel !== null) {
        // 检查是否在选中的频道中
        if (selectedMembers[newChannel.id]) {
            console.log('Joined new channel with selected members:', selectedMembers[newChannel.id]);
        }
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);
