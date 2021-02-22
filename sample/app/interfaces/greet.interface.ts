import { Greetings } from '../enum/index.js';

export interface Greet {
    greeting: Greetings,
    speaker: string
}

export interface GreetResponse {
    message: string;
}
