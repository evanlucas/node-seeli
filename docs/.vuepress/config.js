'use strict'

module.exports = {
  title: 'Seeli'
, base: '/seeli-docs/'
, description: 'The Object orientated, event driven interactive cli framework'
, configureWebpack: {
    resolve: {
      alias: {
        '@alias': '/assets/img'
      }
    }
  }
, themeConfig: {
    logo: '/assets/img/seeli-logo.png',
  }
, plugins: [
    '@vuepress/plugin-back-to-top'
  ]
, head: [
  ]
, themeConfig: {
    sidebar: 'auto'
  , nav: [
      { text: 'Github', link: 'https://github.com/esatterwhite/node-seeli', target:'_self', rel:'' }
    , { text: 'Getting Started', link: '/getting-started' }
    , { text: 'Guides'
      , items: [
          { text: 'Basic'
          , items: [
              { text: 'Commands', link: '/guides/commands' }
            , { text: 'Progress UI', link: '/guides/ui' }
            ]
          }
        , { text: 'Advanced'
          , items: [
              { text: 'Interactive Commands', link: '/guides/interactive' }
            , { text: 'Custom Help', link: '/guides/custom-help' }
            , { text: 'Distributing', link: '/guides/deploying' }
            ]
          }
        ]
      }
    , { text: 'Changelog', link: '/changelog', target:'_self' }
    ]
  }
}

