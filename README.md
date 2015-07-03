# Instavibrant

![Screenshot](https://raw.githubusercontent.com/moneypenny/instavibrant/master/screenshot.png)

## How to Run Locally

[Register an Instagram client](https://instagram.com/developer/clients/register/).

    cp env.sh.example env.sh

Update env.sh with your Instagram client's details.

    bundle install
    npm install
    foreman start -f Procfile.dev

Visit [localhost:5000](http://localhost:5000/) in your browser.

## How to Deploy to Heroku

### First Time

1. [Create a new app on Heroku](https://dashboard.heroku.com/apps).
1. `git remote add heroku git@heroku.com:yourherokuapp.git`
1. `heroku config:add BUILDPACK_URL=https://github.com/heroku/heroku-buildpack-ruby.git`
1. `heroku config:set RACK_ENV=production`
1. `heroku config:set INSTAGRAM_CLIENT_ID=your_instagram_client_id`
1. `heroku config:set LOCAL_STORAGE_KEY=instavibrant`
1. `heroku config:set FRONT_END_URI=url_to_your_heroku_app`
1. `git push heroku master`
1. `heroku ps:scale web=1`

### After It Has Been Deployed Once

    ./deploy.sh
