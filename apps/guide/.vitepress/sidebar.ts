export const sidebar = [
  {
    text: 'Welcome',
    collapsed: false,
    items: [
      { text: 'Introduction', link: '/introduction' },
      { text: "What's new", link: '/welcome/whats-new' }
    ]
  },
  {
    text: 'Setup',
    collapsed: true,
    items: [
      { text: 'Installation', link: '/setup/installation' },
      { text: 'Bot account', link: '/setup/setting-up-bot-account' },
      { text: 'Chat', link: '/setup/chat-with-bot' }
    ]
  },
  {
    text: 'Development',
    collapsed: true,
    items: [
      { text: 'Project', link: '/creating/create-project' },
      { text: 'Files', link: '/creating/create-files' },
      { text: 'Structure', link: '/creating/structure' }
    ]
  },
  {
    text: 'Examples',
    collapsed: true,
    items: [
      { text: 'Overview', link: '/examples' }
    ]
  }
]