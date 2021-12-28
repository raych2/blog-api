# Blog API

This RESTful API serves two separate websites, _TOP Blog_ and _TOP Blog Admin_. The API endpoints are authenticated with JSON web tokens via passport-jwt. Routes were tested with Postman.  Authenticated users will not only be able to create, publish, update, and delete blog posts, but they'll also have the ability to delete comments. Viewers will only be allowed to add comments to blog posts. I gained more practice using MongoDB and Mongoose, securing passwords with bcryptjs, and using Express middleware (i.e. express-validator). The project guidelines are listed in [The Odin Project](https://www.theodinproject.com/paths/full-stack-javascript/courses/nodejs/lessons/blog-api) Node.js curriculum.

[Live Demo on Heroku](https://rt-blog-api.herokuapp.com/)

## Related Repositories

- [TOP Blog](https://github.com/raych2/blog-client) / [Live Demo](https://raych2.github.io/blog-client/#/)
- [TOP Blog Admin](https://github.com/raych2/blog-admin) / [Live Demo](https://raych2.github.io/blog-admin/#/)

## Technologies Used

- CSS, JavaScript
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Express](https://expressjs.com/)
- [Heroku](https://www.heroku.com/)
