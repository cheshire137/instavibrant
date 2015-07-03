# Instavibrant

## How to Run Locally

[Register an Instagram client](https://instagram.com/developer/clients/register/).

    cp app/scripts/config.json.example app/scripts/config.json

Update app/scripts/config.json with your Instagram client's details.

    bundle install
    npm install
    foreman start -f Procfile.dev

Visit [localhost:3001](http://localhost:3001/) in your browser.
