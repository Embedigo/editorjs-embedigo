/* eslint-disable no-useless-escape */
export default {
    youtube_video: {
        regex: /(?:https?:\/\/)?(?:www\.)?(?:(?:youtu\.be\/)|(?:youtube\.com)\/(?:v\/|u\/\w\/|embed\/|watch))(?:(?:\?v=)?([^#&?=]*))?((?:[?&]\w*=\w*)*)/,
    },
    vimeo_video: {
        regex: /http[s]?:\/\/[www\.]?vimeo\.com\/([0-9]+)/,
    },
    twitter_tweet: {
        regex: /http[s]?:\/\/[www\.]?twitter\.com\/([A-z0-9_]+)\/status\/([0-9]+)/,
    },
    telegram_post: {
        regex: /http[s]?:\/\/t\.me\/([A-z0-9_]+)\/([0-9]+)/,
    },
    instagram_post: {
        regex: /https?:\/\/www\.instagram\.com\/p\/([^\/\?\&]+)\/?/,
    },
    github_gist: {
        regex: /https?:\/\/gist\.github\.com\/([^\/\?\&]+)\/([^\/\?\&]+)\/?/,
    },
    facebook_post: {
        regex: /https?:\/\/www\.facebook\.com\/([^\/\?\&]+)\/posts\/([^\/\?\&]+)\/?/,
    },
    coub_video: {
        regex: /http[s]?:\/\/[www\.]?coub\.com\/(?:view|embed)\/([A-z0-9_]+)/,
    },
    codepen_pen: {
        regex: /https?:\/\/codepen\.io\/([^\/\?\&]+)\/pen\/([^\/\?\&]+)\/?/,
    },
};