# ghournal
> a command-line based blog engine for static sites

![logo](./logo.png)


[ghournal](https://npmjs.com/package/ghournal) is a commandline based blog management
tool written in Javascript. The tool is primarily oriented towards static sites
hosted on github-pages. 

### Developer
- **Name** Ganesh Prasad (GnsP)
- **Email** sir.gnsp@gmail.com
- **IRC** gnsp

### Background, Motivation and Intended Use-Cases
Well, I was thinking about creating a [portfolio for myself](https://gnsp.github.io)
complete with a blog section. As for the blog section of the portfolio, the options
were few, Jekyll was probably the best option. But I wanted something more like a
dedicated blog-engine where I would have to worry only about the content. The more
content oriented option was to manage the blog from [Blogger](https://blogger.com)
and serve the content using an Angular frontend connected to the Google Blogger API.
But with that option I was to leave the terminal console and use the blogger web
interface to write posts. I wanted something simpler and lightweight, with which
I would be able to write and publish the posts without leaving the command-line
environment. So I decided upon the following requirements.

1. Blog management should be possible from the commandline environment.
2. The tool should expose a git like command structure for convenience of use.
3. I should not be bothered about building the entire site again everytime I add a new post.
4. The tool should expose a directory structure like a REST api, containing pre-built JSON files describing the blog and the posts.
5. The REST like API should be usable with Angular and similar frontend frameworks for Single Page Apps.
6. The tool must be lightweight and flexible.
7. The primary target for hosting is github-pages.

Hence, based on these requirements, I decided to build a new blog management system.
As we can see from the requirements, it's intended to be used by developers who 
like to work from the commandline environment mostly.

### Installation
The package is available on npm and that makes the installation easier than anything.
**Note** *This package is intended to be used as a standalone tool rather than a module,
  so a global installtion might be more convenient than a local one.*

```sudo npm install -g ghournal```

That does the installation.

### Commands Manual
As mentioned above the tool exposes a git like command structure for the convenience 
and ease of use. But before we go into the command structure, let's first explore
the directory structure of a Blog and the contents of the files.

#### Directory Structure

```
Blog
├── assets
├── author.json
├── blog.json
├── categories.json
├── posts
│   ├── postID
│   │   ├── assets
│   │   ├── draft.blogpost
│   │   └── post.json
│   .
|   .
|   .
|
├── posts.json
└── timeline.json
```

- **Blog** This is the root diectory of your blog. You can name it as you like.
- **assets** This directory contains static assets like images and CSS files for your blog.
- **posts** Your blogposts reside inside this directory. A separate directory is created for each post. The name of the directory for a post is same as its postID.
- **posts/postID** This is the directory for the post with the id postID.
- **posts/postID/assets** Directory to put static assets associated with the post.
- **posts/postID/draft.blogpost** This is the file where the draft version of your post is stored. You can edit it manually or by using the `ghournal edit <postID>` command.
- **posts/postID/post.json** This is the json file compiled from your draft when you run the command `ghournal publish <postID>`. When retrieving posts from a client side MVP framework like angular, you do a get request on this file.
- **blog.json** Json file contatining information about the blog.
- **author.json** Json file containing information about the author.
- **categories.json** Json file containing information about categories of posts and the posts in each category.
- **posts.json** Json file containing information about each and every post you write, published and draft alike.
- **timeline.json** This file gives a timeline view of your posts.


