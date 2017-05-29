let {
  cd,
  exec,
  echo,
  touch
} = require('shelljs')
let url = require('url')

let repoUrl

let pkg = require("../package.json")

if (typeof pkg.repository === 'object') {
  if (!pkg.repository.hasOwnProperty('url')) {
    throw new Error("URL does not exist in repository section")
  }
  repoUrl = pkg.repository.url
} else {
  repoUrl = pkg.repository
}

let parsedUrl = url.parse(repoUrl)
let repository = parsedUrl.host + parsedUrl.path;
let ghToken = process.env.GH_TOKEN
let authorEmail = process.env.COMMIT_AUTHOR_EMAIL

echo('Deploying docs!!!')
cd('dist/docs')
touch('.nojekyll')
exec('git init')
exec('git config user.name "k1r0s"')
exec(`git config user.email "${authorEmail}"`)
exec('git add .')
exec('git commit -m "docs(docs): update gh-pages"')
exec(`git push --force --quiet "https://${ghToken}@${repository}" master:gh-pages`)
echo('Docs deployed!!')
