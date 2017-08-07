import { MeanYoutubeFavPage } from './app.po';

describe('mean-youtube-fav App', () => {
  let page: MeanYoutubeFavPage;

  beforeEach(() => {
    page = new MeanYoutubeFavPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
