<a href="https://developers.exlibrisgroup.com/appcenter/download-bib/">![CloudApp Activations](<https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fapps01.ext.exlibrisgroup.com%2Fappstats.json&query=%24%5B%3F(%40.cloud_app_id%3D%3D'obvsg%2Falma-download-bib')%5D.user_count&style=flat&label=Cloud%20App%20Activations>)</a>
<a href="https://developers.exlibrisgroup.com/appcenter/download-bib/">![Deployed Version](<https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fapps01.ext.exlibrisgroup.com%2Fapps.json&query=%24%5B%3F(%40.id%3D%3D'obvsg%2Falma-download-bib')%5D.version&label=Deployed%20Version&color=green>)</a>

# Download-BIB

- The alma-download-bib app allows users to select a record in an Alma screen and download the whole record in XML format. No need to create a set to export records.

- By selecting a record, the user can download the bibliographic record, holding records and items in both XML and MARC-XML format.

- This app supports English and German languages for the user interface.

## How to use the app

- after searching for a title, users can find the result as records inside the app. by clicking on the `[more]` button, the app navigates to a new page with some information about the record and two options to download the record.

- one more possible option is to list the `[holding items]` of the selected record. which gives some information about the holdings and a button to navigate to a new page in which user can choose between three options to download the `[holding records]` in two different format or the `[items]` as XML file.

## Create a new Application

- Install the CLI

```
npm install -g @exlibris/exl-cloudapp-cli
```

- Initialize the Cloud App

```
eca init
```

- Start your application

```
eca start
```

- If got an error install the dependencies first then run the dev server

  - with NodeJs v.10(LTS)

    ```
    npm install
    ```

  - with NodeJs v.14(LTS)

    ```
    npm install --legacy-peer-deps
    ```
