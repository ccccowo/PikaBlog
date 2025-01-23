'use strict';
// 立即执行的代码
console.log('正在加载脚本文件...');
console.log('过滤器插件已加载'); // 检查插件是否加载
// 确保 hexo 对象存在
if (!hexo) {
  console.error('hexo 对象未定义!');
  return;
}
// 只在文章渲染前检查
hexo.extend.filter.register('before_post_render', function (data) {
  // 如果没有设置 share，默认为 false
  if (typeof data.share === 'undefined') {
    data.share = false;
  }
  // 如果不分享，返回 null 阻止渲染
  if (data.share === false) {
    console.log(`跳过文章: ${data.title}`);
    return null;
  }
  console.log(`生成文章: ${data.title}`);
  return data;
});
// 在生成前过滤文章
hexo.extend.filter.register('before_generate', function () {
  console.log('开始过滤文章...');
  // 获取所有文章
  const posts = hexo.locals.get('posts');
  // 过滤文章
  const filteredPosts = posts.filter(post => {
    // 如果没有设置 share，默认为 false
    if (typeof post.share === 'undefined') {
      post.share = false;
    }
    if (post.share)
      console.log(`保留文章: ${post.title}`);
    return post.share === true;
  });
  // 更新文章列表
  hexo.locals.set('posts', filteredPosts);
});
// 监听文件变化
hexo.on('generateBefore', () => {
  // 强制更新 locals
  hexo.locals.invalidate();
});