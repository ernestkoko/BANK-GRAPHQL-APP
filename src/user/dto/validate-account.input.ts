import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsString } from "class-validator";
import { FindUserInput } from "./find-user.input";

@InputType({description: 'An object that defines the expected input when validating a user\'s name.'})
export class ValidateAccountInput extends FindUserInput {

    @Field({description: 'User\'s full name'})
    @IsString()
    @IsNotEmpty()
    user_account_name: string;
}