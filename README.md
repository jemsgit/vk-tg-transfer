# vk-tg-transfer

Simple bot for reposting from VK group to Telegram channel. Watches for posts with one image and hash tag. You can setup gruop/channel settings and tag at settings.js file, than build it and use.

Also you can check last-posts number in last-posts.json. It uses json file as database to understand which posts are new.

Check runs every 5 minutes.

Dont forget to setup VK_TOKEN and TG_TOKET in .env and add Telegram bot to channel with posting permission.

## Settings

```
settings = {
  [vk_group_id]: {
    tgChannel: '@channel_name',
    tag: 'tag_to_watch'
  }
}
```

### Example

```
settings = {
  77655964: {
    tgChannel: '@clubnycoffee',
    tag: 'афиша_nycoffee'
  },
  42471820: {
    tgChannel: '@druzhba_saratov',
    tag: 'афиша_дружба'
  }
}
```

## Build

npm run build

## Start

npm run start
