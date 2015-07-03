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
