const vueNewDramaModel = require('../../models/vue-new-drama');
const episodesModel = require('../../models/vue-new-episode');
const usersModel = require('../../models/botusers');

const UploadingNewEpisode = async (ctx, txt, dt, bot) => {
    try {
      // Parse the text command to extract parameters.
      // Expected format: some_text_part_ep_EpisodeNumber_size_info_epMsgId_info, etc.
      let data = txt.split('_');
  
      // Get the episode number (e.g. if data[3] is "E05", ep becomes "05")
      let ep = data[3].match(/E(\d+)/)[1];
  
      // Get the file size (append " MB" for display purposes)
      let size = data[4].substring(1) + " MB";
      let sizeWeb = data[4].substring(1).trim();
  
      // Get the message ID for the episode (removing any prefix characters)
      let epMsgId = data[5].substring(5);
  
      // Get channel-related information from the Telegram context
      let chatId = ctx.channelPost.chat.id;
      let idToDelete = ctx.channelPost.message_id;
      let cname = ctx.channelPost.sender_chat.title;
      let chan_id = ctx.channelPost.sender_chat.id;
  
      // Default quality values and subtitles for captions
      let quality = '540p HDTV H.264';
      let db_quality = "540p";
      let subs = '#English Soft-subbed';
      let totalEps = '';
      let nano = ''; // Placeholder (if needed later)
  
      // Find the drama record for the current channel
      let query = await vueNewDramaModel.findOne({ chan_id });
      if (query.noOfEpisodes.length == 1) {
        totalEps = `/0${query.noOfEpisodes}`;
      } else {
        totalEps = `/${query.noOfEpisodes}`;
      }
  
      // If the uploaded episode is the last one, mark the drama as Completed.
      if (query.noOfEpisodes == ep) {
        await vueNewDramaModel.findOneAndUpdate(
          { chan_id },
          { $set: { status: "Completed" } }
        );
      }
  
      // Build the episode display word
      let _ep_word = `📺 Episode ${ep}${totalEps}`;
  
      // Create a backup of the message by copying it to your database channel.
      let success = await bot.api.copyMessage(dt.backup, dt.databaseChannel, Number(epMsgId));
  
      // Adjust quality and subtitle settings based on text commands.
      if (txt.includes('540p_WEBDL')) {
        quality = '540p WEBDL';
      } else if (txt.includes('480p_WEBDL')) {
        quality = '480p WEBDL';
        // (Optional: set additional parameters if needed)
        db_quality = "480p";
      } else if (txt.includes('NK')) {
        quality = '540p HDTV H.265';
        subs = '#English Hard-subbed';
      } else if (txt.includes('NN=')) {
        quality = '540p HDTV H.265';
        subs = '#English sub';
        let subId = txt.split('NN=')[1];
        epMsgId = `TT${epMsgId}TT${subId}`;
      } else if (txt.includes('SOJU')) {
        quality = '480p HDTV H.265';
        subs = '#English Hard-subbed';
      } else if (txt.includes('KIMOI')) {
        quality = '360p HDTV H.264 (kimoiTV)';
        subs = '#English Hard-subbed';
      } else if (txt.includes('720p_WEBDL')) {
        quality = '720p WEBDL';
        db_quality = "720p";
      } else if (txt.includes('720p_HDTV')) {
        quality = '720p HDTV';
        db_quality = "720p";
      } else if (txt.includes('1080p_WEDDL')) {
        quality = '1080p WEBDL';
        db_quality = "1080p";
      } else if (txt.includes('dual')) {
        // For dual episodes, append the next episode number (formatted with two digits)
        ep = ep + '-' + ('0' + (Number(ep) + 1)).slice(-2);
      }
  
      // Create or update the episode record in the database.
      let episode_post = await episodesModel.findOneAndUpdate(
        { epno: Number(ep), drama_chan_id: query.chan_id, quality: db_quality },
        {
          $set: {
            epid: Number(epMsgId),
            size,
            drama_name: query.newDramaName,
            poll_msg_id: 666, // Placeholder value; will be updated after poll creation.
            backup: success.message_id,
          },
        },
        { new: true, upsert: true }
      );
  
      // Build an alternative download link using the episode record ID.
      let option2 = `http://dramastore.net/download/episode/option2/${episode_post._id}/shemdoe`;
  
      // Send a poll message to the channel asking for quality feedback.
      let poll = await bot.api.sendPoll(
        chatId,
        `${_ep_word} | ${quality} with English subtitles`,
        ['👍 Good', '👎 Bad'],
        {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: `📥 DOWNLOAD NOW E${ep} [${size}]`,
                  url: `https://${dt.link}marikiID-${episode_post._id}`,
                },
              ],
              [
                { text: '📥 LINK #2', url: option2 },
                { text: '💡 Help', callback_data: 'newHbtn2' },
              ],
            ],
          },
        }
      );
  
      // Prepare a caption for a notification message
      let caption = `<b>🎥 ${episode_post.drama_name} - Episode ${episode_post.epno}</b>\n\n` +
                    `🔔 New episode (${episode_post.quality}) with English subtitles just uploaded 🔥\n\n` +
                    `<b>🔗 Check it Out!\nwww.dramastore.net/new/episodes</b>`;
  
      // Send a notification message to the designated channel if notifications are enabled.
      if (query.notify === true) {
        await bot.api.sendMessage(dt.aliProducts, caption, {
          parse_mode: 'HTML',
          link_preview_options: { is_disabled: true },
        });
      }
  
      // Delete the original message to clean up the channel.
      await bot.api.deleteMessage(chatId, idToDelete);
  
      // Update the episode record with the poll message ID.
      await episodesModel.findByIdAndUpdate(episode_post._id, {
        $set: { poll_msg_id: poll.message_id },
      });
  
      // Update the user record (for example, to count downloads).
      await usersModel.findOneAndUpdate(
        { userId: 741815228 },
        { $inc: { downloaded: 1 } }
      );
    } catch (error) {
      console.log('Error on posting episode:', error);
      throw error;
    }
  };
  
  module.exports = UploadingNewEpisode;