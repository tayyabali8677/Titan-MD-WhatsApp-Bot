function mockFetch(platform, url) {
  return {
    platform,
    title: `Sample ${platform} content`,
    author: 'titan-mock',
    url: url || `https://${platform}.com/mock`,
    download: `https://cdn.titanmd.site/mock/${platform}/sample.mp4`,
    mock: true,
  };
}
module.exports = { mockFetch };
