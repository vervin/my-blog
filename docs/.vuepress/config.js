const navConf = require('./config/navConf.js');

module.exports = {
  "title": "Vervin's blog",
  "description": "Looking at the stars with your feet on the ground.",
  "dest": "public",
  "head": [
    [
      "link",
      {
        "rel": "icon",
        "href": "/favicon.ico"
      }
    ],
    [
      "meta",
      {
        "name": "viewport",
        "content": "width=device-width,initial-scale=1,user-scalable=no"
      }
    ]
  ],
  "theme": "reco",
  "themeConfig": {
    "nav": navConf,
    "type": "blog",
    "authorAvatar": '/head.png',
    "blogConfig": {
      "category": {
        "location": 2,
        "text": "Category"
      },
      "tag": {
        "location": 3,
        "text": "Tag"
      }
    },
    "themePicker": false,
    "logo": "/head.png",
    "search": true,
    "searchMaxSuggestions": 10,
    "subSidebar": 'auto',
    "author": "vervin",
    "record": "粤ICP备19035439号-1",
    "startYear": "2017",
    "valineConfig": {
      "appId": 'ukqzyFu5lDuUlwbCQoisVRkz-gzGzoHsz',// your appId
      "appKey": '0Hzjy8HKvFj6zLaIRXCJqHGt', // your appKey
    }
  },
  "markdown": {
    "lineNumbers": true
  },
  plugins: [["vuepress-plugin-auto-sidebar", {}]]

}