# Node API Decorator

Elegant decorators that make your API easy and classy.

___

### Table of Contents
**[Motivation](#motivation)**<br>
**[Getting Started](#getting-started)**<br>
**[Configs](#configs)**<br>

## Motivation

Thinking of a cleaner way of developing NodeJs APIs, Node API Decorator was created.

When developing Node APIs using [Express](https://expressjs.com/), some steps are required in order to achive the basic usage of the tool:

-   Creating the router

`const router = express.Router();`

-   Vinculating the API resources

`router.get('my-api-resource', function(request, response) {});`

-   Attaching the router to the server

`server.use('api-base-path', router);`

This is not a difficult thing to do, but in terms os scalability and readability things might get a bit hard to maintain.

When designing the structure of your API, one of the common concerns is: having a simple way to handle routes (resources).

This not only involves declaring the resources, but also receiving the content from a Request and returning to a Response.

That's the main purpose of this library: to help you improving the quality of your code by structuring the basics for you.

---

## Getting Started

`npm install api-decorator`

To start using the decorators for the API (resources), you should firstly follow a minimum standard, so that this library can do its best to help you out.

### Controllers

I'm calling here *Controllers* the files where you're about to put your resources declarations.

They must export as default a class, which will be instantiated and associated on Express.

Example of a Controller:

```javascript
// controllers/user.controller.js
import {Controller, Post, Get, Body, Query} from 'api-decorator';

@Controller('/user')
export default class UserController {
    @Post()
    createUser(@Body() user) {
        return this.userService.create(user);
    }

    @Get('/custom-get')
    customGetUser(@Query() query) {
        return this.userService.get(query);
    }
}
```

By declaring the `@Controller` with `'/user'`, we are attaching this route on Express with this prefix.

The same way that when declaring `@Get` with `'/custom-get'`, we are attaching the concatenation of `/user` + `/custom-get`.

After having your controllers created, you should export them in a `index` file, just like below:

```javascript
// controllers/index.js
export {default as UserController} from './user.controller.js';
```

Now, you only have to tell *api-decorator* where your main controllers exporter is located.

You can create a config file, according to the [Configs](#configs) section.

---

## Configs

You can create a file `.apidecoratorrc` on the root folder of your project, and put there the configurations you need.

Example of a file:

```json
{
  "controllers": "src/controllers/index.js"
}
```

| Key    | Description    | Example | Mandatory    | Default Value    |
| ------ | -------------- | ------- | :------------: | :----------------: |
| controllers | The path for your controllers exporters | "src/controllers/index.js" | Yes | - |
