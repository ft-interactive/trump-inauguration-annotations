export default () => ({ // eslint-disable-line

  // link file UUID
  id: '32897c9a-d984-11e6-944b-e7eb37a6aa8e',

  // canonical URL of the published page
  // https://ig.ft.com/sites/trump-inauguration-annotations get filled in by the ./configure script
  url: 'https://ig.ft.com/sites/trump-inauguration-annotations',

  // To set an exact publish date do this:
  //       new Date('2016-05-17T17:11:22Z')
  publishedDate: new Date('2017-01-20T18:33:00Z'),

  headline: 'Donald Trump’s inauguration day speech — annotated',

  // summary === standfirst (Summary is what the content API calls it)
  summary: 'The full transcript with FT correspondents’ notes and comments',

  topic: {
    name: 'Donald Trump',
    url: 'https://www.ft.com/donald-trump',
  },

  relatedArticle: {
    text: '',
    url: '',
  },

  mainImage: {
    title: '',
    description: '',
    url: '',
    width: 2048, // ensure correct width
    height: 1152, // ensure correct height
  },

  // Byline can by a plain string, markdown, or array of authors
  // if array of authors, url is optional
  byline: [
    { name: 'Glynn Phillips', url: 'https://twitter.com/glynnphillips' },
    { name: 'Caroline Nevitt', url: 'https://www.ft.com/topics/authors/Caroline_Nevitt' },
    { name: 'Shawn Donnan', url: 'https://www.ft.com/stream/authorsId/Q0ItMDAwMTI0NQ==-QXV0aG9ycw==' },
    { name: 'Barney Jopson', url: 'https://www.ft.com/stream/authorsId/Q0ItMDAwMDc5MA==-QXV0aG9ycw==' },
    { name: 'David J Lynch', url: 'https://www.ft.com/stream/authorsId/ZmZjOWNjZDQtZmE2MC00MTA4LWI5NWMtNjUwNjI5OTM0ZTQw-QXV0aG9ycw==' },
    { name: 'Joanna S Kao', url: 'https://www.ft.com/joanna-kao' },
    { name: 'Martin Stabe', url: 'https://www.ft.com/martin-stabe' },
    { name: 'Lauren Leatherby', url: 'https://www.ft.com/lauren-leatherby' },
  ],

  // Appears in the HTML <title>
  title: 'Donald Trump inauguration speech annotated transcript',

  // meta data
  description: 'Donald Trump inauguration speech, annotated by the FT',

  /*
  TODO: Select Twitter card type -
        summary or summary_large_image

        Twitter card docs:
        https://dev.twitter.com/cards/markup
  */
  twitterCard: 'summary',

  /*
  TODO: Do you want to tweak any of the
        optional social meta data?
  */
  // General social
 socialImage: 'https://www.ft.com/__origami/service/image/v2/images/raw/http%3A%2F%2Fcom.ft.imagepublish.prod.s3.amazonaws.com%2F209eeefc-df33-11e6-86ac-f253db7791c6?source=ig&fit=scale-down&width=1200',
  // socialHeadline: '',
  // socialSummary:  '',

  // TWITTER
  // twitterImage: '',
twitterCreator: '@ft',
  // tweetText:  '',
//twitterHeadline:  'Trump\'s #Inauguration speech transcript, annotated',

  // FACEBOOK
  // facebookImage: '',
  // facebookHeadline: '',

  tracking: {

    /*

    Microsite Name

    e.g. guffipedia, business-books, baseline.
    Used to query groups of pages, not intended for use with
    one off interactive pages. If you're building a microsite
    consider more custom tracking to allow better analysis.
    Also used for pages that do not have a UUID for whatever reason
    */
    // micrositeName: '',

    /*
    Product name

    This will usually default to IG
    however another value may be needed
    */
    // product: '',
  },
});
