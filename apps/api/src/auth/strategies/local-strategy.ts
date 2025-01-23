import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import {Strategy} from "passport-local"
import { AuthService } from "../auth.service";

/* 
In the Local Strategy of Passport.js, the fields usernameField and passwordField are used to specify the names of 
the form fields from which Passport will extract the username (or email) and password during the authentication process.

When the local strategy is activated by the authguard, it look inside the body of the post request and extract email in 'usernameField' and password, then pass them to the validate function
*/

// LocalStrategy Class:
// This class implements the Local Strategy for authentication using Passport in a NestJS application.
// 1. It extends `PassportStrategy` with `passport-local`.
// 2. The `super` constructor customizes Passport to look for the `email` field instead of the default `username`.
// 3. The `validate` method is called automatically during authentication:
//    - It checks if a password is provided.
//    - If the password is empty, an `UnauthorizedException` is thrown with a message.
//    - Otherwise, it calls the `AuthService` to validate the user's credentials (email and password).
// This strategy is used for handling local (email/password) authentication.

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy){
    constructor(private authService: AuthService){
        super({
            usernameField: "email"
        })
    }

    validate(email: string, password: string){
        if(password === "") throw new UnauthorizedException("Please enter your password");
        return this.authService.validateUserWithLocalStrategy(email, password)
    }
}