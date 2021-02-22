# Api-Decorator Sample Project

## Getting Started

In order to use this example properly, you need to initiate a Git repository on it.

This is crucial due to the fact that we use the base Git path on the project for finding the config file (`.apidecoratorrc`).

`git init`

After that, you can just install the dependencies:

`npm install`

Now, you simply run the project with:

`npm run dev`

Watch mode:

`npm run dev:watch`

Endpoints available for test:

- greet
  Method: POST
  Data: { greeting: Greetings, speaker: string }
- greet/last-greet
  Method: GET
- greet/last-speaker
  Method: GET
- greet/last-talk
  Method: GET

Have fun!