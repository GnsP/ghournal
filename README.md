# ghournal
> a command-line based blog engine for static sites

![logo](./logo.png)


[ghournal](https://npmjs.com/package/ghournal) is a commandline based blog management
tool written in Javascript. The tool is primarily oriented towards static sites
hosted on github-pages. 

### Live Demo

I have designed a [blog](https://gnsp.github.io/blog) for myself using **ghournal** in the back end.
The blog is the Demo, it can be found at [https://gnsp.github.io/blog](https://gnsp.github.io/blog).


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
8. The posts should be written in markdown for ease of use.

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


*The detailed structure of each file is out of the scope of this document, 
please check the files manually to know about their structure. The files are
generated with proper indentation for human readability.*

#### Initialise a Blog
Go to the directory where you want to create your blog and run

```ghournal init```

This will prompt you to provide information like 'name of the blog', 'tagline',
'url', 'description', 'name of author', 'email of author' etc. After you provide 
these values, it will ask for confirmation and then generate the directory structure
described above.

Now you are all set to start blogging, at least in a backend point of view, you are all set.

#### Add a category
On the base directory of your blog run

```ghournal add-category [categoryNames...]```

This will add the specified categories to the categories.json file. Note that categories
are like Labels in Blogger. But unlike Blogger, you can not add categories while
creating posts. This is an intended feature to guarantee that the user does not 
add more categories than necessary. Keeping the blog interface clean is always more
important than the content itself, because if your interface is cluttered, the 
visitors are more likely to lose interest before going through the actual content.

#### Create a new post
On the base directory of your blog run

```ghournal new [postID]```

The postID is required to be unique. If you provide a postID that's not unique or
you do not provide a postID at all, the tool will prompt you to provide one as long
as you do not come up with a valid and unique postID or choose to exit with a `Ctrl+C`.

After you give a unique postID, it will prompt you to give a title (default value of
which is the current date in 'DDth MONTH, YYYY' format) and an abstract. Then it'll
create the directories and files reauired for the post and spawn Vim with the draft.blogpost
open in it for editing. The command will exit as soon as you exit the Vim.

#### Edit a post
On the base directory of your blog run

```ghournal edit [postID]```

The postID here should be the ID of an existing post. If you do not provide a postID 
or provide a postID that's not created before, you'll be prompted to give a valid postID.
Once you give a valid postID, the command will spawn Vim with the draft.blogpost file
of the post for editing. The command will exit as soon as you exit vim.

#### Publish a post

On the base directory of your blog run

```ghournal publish <postID>```

The postID should be that of an existing post. This will compile the draft from 
markdown to html and store the info in post.json and other associated files. This 
will also mark the post as published.

#### List posts

On the base directory of your blog run

```ghournal list [categoryNames...]```

This will list all posts tagged with provided category names. If no category names
are given, this will simply list every post out there. The list is displayed in a
tree like structure for convenience.

#### Read a post

On the base directory of your blog run

```ghournal view <postID>```

This will display the contents of the post inside the terminal. The html would be
converted to text and displayed in a readable manner.


### Concluding Remarks

Here are few points worth considering.

- This tool is a Beta, as of now. If you find a bug, please report here in the issue tracker. I'll be more than obliged if you choose to fix a bug or contribute in any way and send me a pull request.

- In the next major version, i.e. v2.0.0, the plan is to add a new command `ghournal deploy` which will generate some frontend files automatically.

- I also want to provide some sort of plug-in and themeing support for the blogs.

- And as the last remark of this manual, *"write your thoughts before they are forgotten and lost"*.
