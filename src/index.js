const easyvk = require('easyvk');
const TelegramBot = require('node-telegram-bot-api');
const settings = require('./settings');
const { getLastSavedPostId, saveLastPostId } = require('./file-manager');

require('dotenv').config();

const attachmentType = 'photo';

const vkToken = process.env.VKTOKEN;
const tgToken = process.env.TGTOKEN;

const bot = new TelegramBot(tgToken, {polling: true});

function getLastPost(vkr, tag) {
  let posts = (vkr.items || [])
        .filter(({attachments, text}) => {
          if(!attachments || !attachments.length) {
            return;
          }
          let imageAttachments = attachments.filter(({type}) => type === attachmentType);
          return imageAttachments.length === 1 && text.includes(tag);
        })
        .sort((a,b) => {
          return b.date - a.date;
        })
        .map(({id, attachments, text}) => {
          let photoSizes = attachments.find(({type}) => type === attachmentType).photo.sizes;
          const bestPhoto = photoSizes[photoSizes.length - 1];
  
          return {
            id,
            photo: bestPhoto.url,
            text
          }
        });
    return posts[0];
}

function checkPostIsNew(post, source) {
  const lastPostId = getLastSavedPostId(source);
  return post.id !== lastPostId;
}

function escapeVkMarkup(text) {
  let tagRegex = /\[(.*?)\|(.*?)\]/g
  let match = tagRegex.exec(text);
  while(match) {
    if(match[2]) {
      text = text.replace(/\[(.*?)\|(.*?)\]/, match[1]);
    }
    match = tagRegex.exec(text);
    console.log(match)
  }
  return text;
}

async function checkPostsForGroup(groupId, tgDest, tag) {
  easyvk({
    token: vkToken
  }).then(vk => {
    return vk.call("wall.get",{
      owner_id: -groupId
    });
  }).then(async (vkr) => {
    let post = getLastPost(vkr, tag);
    console.log(post.text);
    if(!post || !checkPostIsNew(post, groupId)) {
      return;
    }
    await bot.sendPhoto(tgDest, post.photo, {caption: escapeVkMarkup(post.text)});
    saveLastPostId(post.id, groupId);
  }).catch(error => {
    console.log(error);
  })
}

async function checkAll() {
  let groups = Object.keys(settings);
  for(let i =0; i < groups.length; i++) {
    checkPostsForGroup(groups[i], settings[groups[i]].tgChannel, settings[groups[i]].tag);
    await sleep(1000);
  }
}

async function sleep(ms) {
  return new Promise(res => {
    setTimeout(res, ms);
  });
}

function sheduleMainTask(seconds) {
  setInterval(checkAll, seconds * 1000);
}

sheduleMainTask(60*5);

checkAll()