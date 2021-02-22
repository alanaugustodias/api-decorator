import { Response } from 'express';

import { Controller, Get, Post, Inject, Res, Body } from 'api-decorator';
import { Greet, GreetResponse } from '../interfaces/index.js';
import { GreetService } from '../services/index.js';
import { Injectables } from '../constants/index.js';
import { Greetings } from '../enum/index.js';

console.log('@@@@@@@@', GreetService)

@Controller('/greet')
export default class GreetController {
    @Inject(Injectables.GreetService)
    private greetService: GreetService;

    @Post()
    public greet(@Body() body: Greet, @Res() res: Response): GreetResponse | undefined {
        try {
            console.log(this.greetService);
            const greet: Greet = body;
            this.greetService.greet(greet);
            return { message: 'Greeted successfully!' };
        }
        catch (error) {
            res.status(400).json({
                message: 'Couldn\'t greet.',
                reason: JSON.stringify(error)
            });
        }
    }

    @Get('/last-greet')
    public getLastGreet(): Greetings | null {
        return this.greetService.getLastGreeting();
    }

    @Get('/last-speaker')
    public getLastSpeaker(): string {
        return this.greetService.getLastSpeaker();
    }

    @Get('/last-talk')
    public getLastTalk(): string {
        return this.greetService.getLastTalk();
    }
}
