# Instavibrant

## How to Run Locally

[Register an Instagram client](https://instagram.com/developer/clients/register/).

    cp app/scripts/config.json.example app/scripts/config.json
    cp env.sh.example env.sh

Update app/scripts/config.json and env.sh with your Instagram client's details.

    bundle install
    npm install
    foreman start -f Procfile.dev

Visit [localhost:5000](http://localhost:5000/) in your browser.
