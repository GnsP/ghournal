var pug = require('pug');
var util = require('./utility.js');

function renderBlog (_blog, timeline, posts, categories) {
  var blog = Object.assign({}, _blog);

  var data = { blog: blog };
  data.blog.hasLinks = Array.isArray(data.blog.links) && data.blog.links.length > 0;
  var years = [];
  for (var key in timeline) {
    if (timeline.hasOwnProperty(key)) {
      if (key === 'filepath' || isNaN(Number(key))) continue;
      years.push({
        year:key,
        months: Object.keys(timeline[key]).reduce(function (acc, month) {
          if (util.months.indexOf(month) === -1) return acc;
          acc.push({ month: month, monthIndex: util.months.indexOf(month), posts: timeline[key][month]});
          return acc;
        }, [])
      });
    }
  }
  years.sort(function (a, b) {
    return Number(b.year) - Number(a.year);
  });
  years.forEach(function (year) {
    year.months.sort(function(a, b) {
      return b.monthIndex - a.monthIndex;
    });
  });

  var postIDs = [];
  years.forEach(function (year) {
    year.months.forEach(function (month) {
      postIDs = postIDs.concat(month.posts);
    });
  });

  data.posts = postIDs.map(function (post) {
    var p = Object.assign({}, posts[post.postID]);
    p.categoryObjs = p.categories.map(function (_cat) {
      return { name:_cat, href: blog.baseurl+'/categories/'+_cat+'.html' };
    });
    return p;
  });

  var tags = [];
  Object.keys(categories).forEach(function (cat) {
    if (cat !== 'filepath' && categories[cat].length) tags.push({ name:cat, href: blog.baseurl+'/categories/'+cat+'.html' });
  });

  data.categories = tags;

  return pug.renderFile(__dirname+'/../views/index.pug', data);
}

function renderPost (_blog, post, posts, categories) {
  var blog = Object.assign({}, _blog);

  var data = { blog: blog, post: post };
  data.blog.hasLinks = Array.isArray(data.blog.links) && data.blog.links.length > 0;
  data.blog.stylesheet = data.blog.baseurl+'/'+data.blog.stylesheet;
  var similar = [];
  var similarSet = {};
  post.categories.forEach(function (cat) {
    if (similar.length >= 10) return;
    similar = similar.concat(categories[cat].filter(function (pid) {
      return !similarSet[pid] && pid !== post.id;
    }).map(function (pid) {
      similarSet[pid] = true;
      var p = Object.assign({}, posts[pid]);
      p.categoryObjs = p.categories.map(function (_cat) {
        return { name:_cat, href: blog.baseurl+'/categories/'+_cat+'.html' };
      });
      return p;
    }));
  });
  data.similar = similar.slice(0, 10);
  data.hasSimilar = data.similar.length > 0;
  data.post.categoryObjs = data.post.categories.map(function (cat) {
    return { name:cat, href: blog.baseurl+'/categories/'+cat+'.html' };
  });

  return pug.renderFile(__dirname+'/../views/post.pug', data);
}

function renderCategory (_blog, category, posts, categories) {
  var blog = Object.assign({}, _blog);

  var data = { blog: blog };
  data.blog.hasLinks = Array.isArray(data.blog.links) && data.blog.links.length > 0;
  data.blog.stylesheet = data.blog.baseurl+'/'+data.blog.stylesheet;
  data.category = { name: category };
  data.category.posts = categories[category].map(function (pid) {
    var p = Object.assign({}, posts[pid]);
    p.categoryObjs = p.categories.map(function (cat) {
      return { name:cat, href: blog.baseurl+'/categories/'+cat+'.html' };
    });
    return p;
  });

  return pug.renderFile(__dirname+'/../views/category.pug', data);
}

module.exports.renderBlog = renderBlog;
module.exports.renderPost = renderPost;
module.exports.renderCategory = renderCategory;
