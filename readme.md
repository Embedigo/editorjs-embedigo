# Embedigo plugin for Editor.js

Provides Block tool for embedded content for the Editor.js. Tool uses embedigo.xyz to handle embeds code.

What is embedigo you can read [here](https://embedigo.xyz/docs#what-is-embedigo)

Thanks editor.js team for original [embed plugin](https://github.com/editor-js/embed).


## Installation

### Install via NPM

Get the package

```shell
npm i --save-dev editorjs-embedigo
```

Include module at your application

```javascript
const EditorjsEmbedigo = require('editorjs-embedigo');
```

## Usage

Add a new Tool to the `tools` property of the Editor.js initial config.

```javascript
var editor = EditorJS({
  ...

  tools: {
    ...
    embedigo: EditorjsEmbedigo,
  },

  ...
});
```

Also you need to include embedigo's script into your page

```html
<script async src="//cdn.embedigo.xyz/embed.js" charset="utf-8"></script>
```

## Available configuration

List of supported providers you can find [here](https://embedigo.xyz/docs#features). All providers enabled by default, you can disable them manually if needed:

```javascript
var editor = EditorJS({
  ...

  tools: {
    ...
    embedigo: {
      class: EditorjsEmbedigo,
      config: {
        services: {
          youtube_video: false,
          coub_video: false
        }
      }
    },
  },

  ...
});
```

## Output data

| Field     | Type     | Description
| --------- | -------- | -----------
| key       | `string` | embed unique key
| provider  | `string` | provider name
| url       | `string` | source URL
| html      | `string` | embed html
| caption   | `string` | content caption


```json
{
  "type" : "embedigo",
  "data" : {
    "caption": "",
    "html": "<div class=\"embedigo-...../>",
    "key": "aaf8fc33",
    "provider": "twitter_tweet",
    "url": "https://twitter.com/freekmurze/status/1313008788593676288"
  }
}
```