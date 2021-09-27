### Table of contest
1. [About](#about)
2. [Important note](#important-note)
2. [Images](#images)
3. [Used technologies](#used-technologies)

<a name="about"></a>

## About

This project will let you create the small adaptive to the browser dimensions the multi-page social app with authorization for posting users thought as text, link to images and youtube videos.
Additionally, users can comment posts and evaluate them. 
Creating new post page supports an automatic save, inserting and deleting components, simple drag and drop effects, downloading draft from the database and erasing it.
Users are able to delete their accounts, set styles to default, choose the styles of components (change the background color and text and misc.), change name, email and password.
Admin user can observe some statistics about users.

<a name="important-note"></a>

## Important note
 1. Create your app in the Firebase console page. Fill in the file **.env.example** with values from the google firebase console, copy it and rename these two files into **.env.production** and **.env.development**.
 2. Run the command **npm start** and type **http://localhost:3000** in the browser


<a name="images"></a>

## Images ##

Post content
![Post content](src/img/Screenshot%202021-09-27%20200549.png)

Part of post content and comments
![Part of post content and comments](src/img/Screenshot%202021-09-27%20200616.png)

Interface change page
![Interface change](src/img/Screenshot%202021-09-22%20213130.png)

Admin statistic page
![statistics](src/img/Screenshot%202021-09-22%20213810.png)

<a name="used-technologies"></a>

## Used technologies
1. Javascript
    1. React router (displays the pages based on the users log state and page paths)
    2. React
    3. Moment.js
2. Bootstrap
3. Firebase firestore (NoSQL database)
4. Firebase auth (for tracing users authorization and their log state)