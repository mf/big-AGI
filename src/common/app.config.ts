/**
 * Application Identity (Brand)
 *
 * Also note that the 'Brand' is used in the following places:
 *  - README.md               all over
 *  - package.json            app-slug and version
 *  - [public/manifest.json]  name, short_name, description, theme_color, background_color
 */
export const Brand = {
  Title: {
    Base: 'crAGI',
    Common: (process.env.NODE_ENV === 'development' ? '[DEV] ' : '') + 'CR-AGI',
  },
  Meta: {
    Description: 'Cityrealty-AGI.',
    SiteName: 'Cityrealty-AGI',
    ThemeColor: '#32383E',
    TwitterSite: '',
  },
  URIs: {
    Home: 'https://ai.cityrealty.com',
    // App: 'https://get.big-agi.com',
    CardImage: 'https://big-agi.com/icons/card-dark-1200.png',
    OpenRepo: 'https://github.com/mf/big-agi',
    // OpenProject: 'https://github.com/users/enricoros/projects/4',
    // SupportInvite: 'https://discord.gg/MkH4qj2Jp9',
    // Twitter: 'https://www.twitter.com/enricoros',
    PrivacyPolicy: 'https://cityrealty.com/privacy',
    SponsorHome: 'https://www.cityrealty.com'
  },
} as const;