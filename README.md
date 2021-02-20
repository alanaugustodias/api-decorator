# Node API Decorator

Elegant decorators that make your API easy and classy.

---

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

## Decorators availables so far

| Decorator     | Description                                           | Params           | Mandatory | Default Value |
| ------------- | ----------------------------------------------------- | ---------------- | :-------: | :-----------: |
| `@Controller` | The class serving as prefix for the route endpoints   | `prefix: string` |    No     |     `''`      |
| `@Route`      | The route endpoint for a method on a Controller class | `path: string`   |    No     |     `''`      |
| `@Req`        | The Request parameter for an endpoint method          | -                |     -     |       -       |
| `@Res`        | The Response parameter for an endpoint method         | -                |     -     |       -       |
| `@Body`       | The Body parameter for an endpoint method             | -                |     -     |       -       |
| `@Query`      | The Query parameter for an endpoint method            | -                |     -     |       -       |
| `@Path`       | The Path parameter for an endpoint method             | `paramName`      |    Yes    |       -       |

## Experimental Decorators

| Decorator     | Description                                                      | Params               |              Mandatory              | Default Value |
| ------------- | ---------------------------------------------------------------- | -------------------- | :---------------------------------: | :-----------: |
| `@Injectable` | Put it on a class you want to make it injectable                 | -                    |                  -                  |       -       |
| `@Inject`     | It sets a class's attribute with the ref for an Injectable class | `identifier: symbol` | Symbol for the class to be injected |       -       |

## Getting Started

`npm install api-decorator`

To start using the decorators for the API (resources), you should firstly follow a minimum standard, so that this library can do its best to help you out.

### Controllers

I'm calling here _Controllers_ the files where you're about to put your resources declarations.

They must export as default a class, which will be instantiated and associated on Express.

- Project structure sample:

```
src
|___controllers
|    |   UserController.ts
|    |   index.ts
|   index.ts
```

- Example of a Controller:

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
export {default as UserController} from './user.controller.ts';
```

Now, you only have to tell _api-decorator_ where your main controllers exporter is located.

You can create a config file, according to the [Configs](#configs) section.

- Example of a startup file (`index.ts`)

```javascript
import express from 'express';
import {BindRoutes} from 'api-decorator';

async function startup() {
    const app = express();
    const routes = await BindRoutes();
    app.use('/', routes);
    const server = app.listen(this.port, () => {
        console.log(`Server is listening on: ${this.port}`);
    });
}

startup();
```

On the example above, you can see that we are importing `BindRoutes` function from _api-decorator_.

This is the function that, with the help of the configuration file on finding the Controllers, will bind every endpoint we declare to _express's Router_

After having the result of the asynchronous `BindRoutes`, you can just use it with the prefix you want for your API, just like: `api.use('/any-thing-you-want', routesBinded)`.

---










### Injectables

As part of the experimental decorators, we have `@Injectables` and `@Inject`.

- `@Injectable``

This decorator is meant to be used on a class you'd like to use its reference injected on a class attribute.

It uses a service for controlling the instance of the injectables, so you will use them as [Singletons](https://en.wikipedia.org/wiki/Singleton_pattern).

To keep a track on every class injected, we use the name of the class on a Symbol.

Example:

```javascript
@Injectable()
class MyService {
    public getName() {
        return 'Name';
    }
}
```

This will add to the injector service an instance of `MyService` tracked by `Symbol.for('MyService')`,

- `@Inject`

This decorator injects an instance of an injectable class.

You must pass as parameter a Symbol with the name of the desired class, so it will set automatically to the related attribute.

Example:

```javascript
import MyService from './my-service.ts';

class MyClass {
    @Inject(Symbol.for('MyService'))
    private _myService: MyService;
}
```

This will retrieve the instance for `MyService` within the injector controller.

- Pro-tip

In order to maintain the injectables names more legible, you could create a constant for that:

```javascript
import MyService from './my-service.ts';

const Injectables = {
    MyService: Symbol.for('MyService')
}

class MyClass {
    @Inject(Injectables.MyService)
    private _myService: MyService;
}
```


## Configs

You can create a file `.apidecoratorrc` on the root folder of your project, and put there the configurations you need.

Example of a file:

```json
{
    "controllers": "src/controllers/index.ts"
}
```

| Key         | Description                             | Example                    | Mandatory | Default Value |
| ----------- | --------------------------------------- | -------------------------- | :-------: | :-----------: |
| controllers | The path for your controllers exporters | "src/controllers/index.ts" |    Yes    |       -       |
