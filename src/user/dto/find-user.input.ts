import { Field, InputType } from "@nestjs/graphql";
import { IsNumberString } from "class-validator";

@InputType({description: 'An object that defines that expected input when getting a user\'s name'})
export class FindUserInput{

    @Field({description: 'User\'s account number'})
    @IsNumberString()
    user_account_number: string;

    @Field({description: 'User\'s bank code'})
    @IsNumberString()
    user_bank_code: string;
}