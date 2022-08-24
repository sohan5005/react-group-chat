# What is it?

Very simple, straight forward group chatting app. Just login with a name and start chatting. Use different device on the local network is supported. To ban someone in the chat just send a message like this `ban:user-id` or `unban:user-id`. Currently anyone can ban anyone. I may work on this feature later. Doesn't have any database integration or functionality to keep chat history. Single chatting session (until the server restarts) is stored in variable in server script which is not recommended at all. Need to optimize the session history and implement database solution if possible.

Check contribution notes for more.

#### <span style="color:#f55">This app was tested only on local environment</span>

## How to get started?

1. Clone the repository
2. Run `npm install` to install all dependency and generate environment variables
3. Run `npm start` to start development server
4. Run `npm run build` for deplyment

### Deployment Notes

1. Before building for production, make sure IP address in environment variables is same as your server IP address
2. Along with serving the react app, you will also have to keep server.js running. I highly recommend to use **pm2** for both

### Contribution

If you would like to contribute, please send a PR with any kind of improvement you can make 😊
