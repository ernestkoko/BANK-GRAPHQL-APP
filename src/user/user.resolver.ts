import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UserService } from "./user.service";
import { User } from "./entities/user.entity";
import { ValidateAccountInput } from "./dto/validate-account.input";
import { HttpException } from "@nestjs/common";
import { FindUserInput } from "./dto/find-user.input";

@Resolver(of  => User)
export class UserResolver{
    constructor(private userService: UserService){}
    
    @Query(returns => String, {description: 'Get a user\'s name that is saved on the database or return from Paystack'})
    async getUserName(@Args('input') input: FindUserInput):Promise<string>{
        try {
            const data = await this.userService.getUserName(input);
            return data;
        } catch(error){
            throw new HttpException(error.message, error.status);
        }
    }

    @Mutation(returns => User)
    async validateAccountName(@Args('input') input: ValidateAccountInput): Promise<User>{
        try {
            return await this.userService.validateAccountName(input);
        } catch( error ){
            throw new HttpException(error.message, error.status);
        }
    }
}