const fs = require('fs');

const dataFilePath = 'last-posts.json';

function fileManager() {
  let lastSavedPosts;
  function getLastSavedPostId(source) {
    if(!lastSavedPosts) {
      let rawdata = fs.readFileSync(dataFilePath);
      lastSavedPosts = JSON.parse(rawdata);
    }
    return lastSavedPosts[source];
  }
  
  function saveLastPostId(postId, source) {
    lastSavedPosts[source] = postId;
    fs.writeFileSync(dataFilePath, JSON.stringify(lastSavedPosts));
  }
  return {
    getLastSavedPostId,
    saveLastPostId
  }
}

module.exports = fileManager();