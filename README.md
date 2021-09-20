# bluemix-todo-apps - node overview

Todo List App using Cloudant services running on Bluemix.

Hosted on: [https://simple-toolchain-20210823172819883.eu-gb.mybluemix.net/](https://simple-toolchain-20210823172819883.eu-gb.mybluemix.net/)

Refer to the [README.md](../README.md) file in the parent directory
for general instructions regarding this application.

## How it Works

1. Add items to the todo list by typing into the box and pressing `Enter`

1. Mark items as complete by clicking the checkmark to the left of the corresponding item.

1. Delete items by clicking the 'X' to the right of the corresponding item that appears on hover.

1. Edit existing todo items by double-clicking on the corresponding item.

## Running the app locally

1. Clone the app to your local environment from your terminal using the following command

  ```
  git clone https://github.com/IBM-Bluemix/todo-apps.git
  ```

2. Configure a database

  ### To use Cloudant as database

  2.1. Create an instance of Cloudant to store the todos

  2.2. Create a set of credentials for this service

  2.3. View the credentials and take note of the `url` value

  2.4. Create a file name `vcap-local.json` in the `node` directory with the following content:

    ```
    {
      "services": {
        "cloudantNoSQLDB": [
          {
            "credentials": {
              "url":"<URL-FROM-THE-SERVICE-KEY-ABOVE>"
            },
            "label": "cloudantNoSQLDB",
            "plan": "Lite",
            "name": "todo-db"
          }
        ]
      }
    }
    ```

    Replace the url with the value retrieved from the service key.

3. Get the application dependencies

  ```
  npm install
  ```

4. Start the application

  ```
  npm start
  ```

### License

[Apache License, Version 2.0](../LICENSE)