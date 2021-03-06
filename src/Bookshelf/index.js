const fs = require('fs');

const Users = require('./models/Users')
const Posts = require('./models/Posts')
const truncate = require('../utils/truncate')
const Time = require('../utils/time')

async function exec() {
  await truncate('posts')
  await truncate('users')
  await Posts.collection().fetch()

  if(!fs.existsSync(`${__dirname}/../../bookshelf.json`)){
    fs.writeFileSync(`${__dirname}/../../bookshelf.json`, JSON.stringify([]))
  }

  const bookshelfData = require('../../bookshelf.json')

  const time = new Time();

  await new Users({
    first_name: 'Open',
    last_name: 'Connection'
  }).save()

  time.init('create:users')
  const user = await new Users({
    first_name: 'Jardel',
    last_name: 'Gonçalves'
  }).save()
  const timeCreateUsers = time.finished('create:users')

  time.init('create:posts')
  await new Posts({
    user_id: user.id,
    title: 'Test Title',
    description: 'Test Description',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vehicula egestas libero a semper. Etiam rutrum, quam ac suscipit ullamcorper, est diam lacinia ex, vel dictum diam mi ac mauris. Nullam diam lectus, euismod in mattis ut, aliquet sed arcu. Phasellus luctus aliquet magna, id faucibus ex condimentum ac. Ut eu odio non ligula varius ultricies et et diam. Nulla facilisi. Praesent ut dui et ligula pharetra bibendum id a velit. Ut lacinia, odio quis finibus congue, nisi odio finibus orci, aliquam suscipit orci dolor finibus lacus. Donec facilisis, sem vitae pretium lacinia, neque eros interdum tortor, non feugiat leo erat vitae diam. Nulla dignissim pharetra justo ac condimentum. Pellentesque semper, lacus sit amet porta facilisis, ligula mauris dictum libero, placerat rhoncus diam tortor id lectus. Donec id efficitur diam. Proin semper ipsum sit amet metus elementum, a volutpat lacus pulvinar. Etiam eleifend egestas tellus eget placerat. Nam dictum leo eget sem tincidunt hendrerit. Nullam vitae nisi a enim vulputate vulputate ac id felis.'
  }).save()
  const timeCreatePosts = time.finished('create:posts')

  time.init('select:users')
  await Users.collection().fetch()
  const timeSelectUsers = time.finished('select:users')

  time.init('select:posts')
  await Posts.collection().fetch()
  const timeSelectPosts = time.finished('select:posts')

  time.init('select:loadPosts')
  const data = await new Users({ id: user.id }).fetch({
    withRelated: ['posts'],
  })
  const timeLoadPostsUser = time.finished('select:loadPosts')

  const dataUpdated = [
    ...bookshelfData,
    {
      create_user: timeCreateUsers,
      create_post: timeCreatePosts,
      select_users: timeSelectUsers,
      select_post: timeSelectPosts,
      select_load_posts_users: timeLoadPostsUser,
    },
  ]

  fs.writeFileSync(`${__dirname}/../../bookshelf.json`, JSON.stringify(dataUpdated))

  process.exit()
}

exec()
