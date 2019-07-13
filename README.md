# React Chat

Interactive chat page with image upload and realtime use status.



## Project Structure

```
.
├── public               // entry html file index.html.
├── node_modules         // Node.js, React.js module
├── src               	 // All the react.js components in here
│   ├── actions          // Redux actions and types register
│   ├── reducer          // Redux reducer build, combine and export
│   └── components       // Child components in here
└── views                // Theme templates of page(html/jade).
```



## User Interface

Use the semanticUI to build the react.js webpage.

It give the easier in usage, we can pay less attention to css adjust and pay more effort to user action, state, and realtime database.



## Google Firebase

Google firbase realtime database is a greate choice to build the real time application.

Its usage is same as mongoDB, both them store data in JSON format. We can use its realtime database, listen the database in app, and do the action when database change.

