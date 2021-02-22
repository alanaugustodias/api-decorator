import {Greet} from '../interfaces/index.js';
import {Greetings} from '../enum/index.js';
import {Injectable} from 'api-decorator';

@Injectable()
class GreetService {
    private lastGreeting: Greetings | null;
    private lastSpeaker: string;
    private lastTalk: string;

    constructor() {
        this.lastGreeting = null;
        this.lastSpeaker = '';
        this.lastTalk = '';
    }

    /**
     * Method for Greeting people
     * @param greet
     */
    public greet(greet: Greet): string {
        if (!(greet.greeting in Greetings)) {
            throw new Error(`To greet someone, you must say one of the following: ${Object.keys(Greetings).join(',')}`);
        }

        if (!greet.speaker) {
            throw new Error(`To greet someone, you must say your name!`);
        }

        this.lastGreeting = greet.greeting;
        this.lastSpeaker = greet.speaker;
        this.lastTalk = `Excuse me... Sir ${this.lastSpeaker} would like to say: ${this.lastGreeting}`;
        return this.lastTalk;
    }

    /**
     * Get the Last Greeting
     */
    public getLastGreeting(): Greetings | null {
        return this.lastGreeting;
    }

    /**
     * Get the Last Speaker
     */
    public getLastSpeaker(): string {
        return this.lastSpeaker;
    }

    /**
     * Get the Last Talk
     */
    public getLastTalk(): string {
        return this.lastTalk;
    }
}

export default GreetService;
