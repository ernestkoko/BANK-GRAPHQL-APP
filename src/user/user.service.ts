import { BadRequestException, HttpException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ValidateAccountInput } from "./dto/validate-account.input";
import { HttpService } from "@nestjs/axios";
import { lastValueFrom } from "rxjs";
import { FindUserInput } from "./dto/find-user.input";

@Injectable()
export class UserService{
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>,
        private readonly HttpService: HttpService
    ){}
    
    async getUserName(input: FindUserInput): Promise<string>{
        try {
            const user = await this.userRepository.findOne({
                where: {
                    account_number: input.user_account_number,
                    bank_code: input.user_bank_code
                }
            });
            const response = await this.validatePaystackName({accountNumber: input.user_account_number, bankCode: input.user_bank_code});
            let userName: string;
            if(user){
                userName = user.account_name;
            } else {
                userName = response.data.account_name;
            }
            return userName;
        } catch(error){
            throw new HttpException(error.message, error.status);
        }
    }
    
    async validateAccountName(input: ValidateAccountInput): Promise<User>{
        try { 
            const response = await this.validatePaystackName({accountNumber: input.user_account_number, bankCode: input.user_bank_code});

            let accountName: string;
            if (response && response.data){
                accountName = response.data.account_name;
            } else {
                throw new InternalServerErrorException('Internal server error!');
            }
            ///Find Levenshtein distance
            const distance = this.findLevenshteinDistanceBeteenStrings(input.user_account_name, accountName);
            if (distance > 2){
                throw new BadRequestException('Account can not be validated!');
            }
            const user = await this.userRepository.save({
                account_name: input.user_account_name,
                account_number: input.user_account_number,
                bank_code: input.user_bank_code,
                verified: true
            });
            return user;
        }catch( error ){
            throw new HttpException(error.message, error.status);
        }
    }

    async validatePaystackName({accountNumber, bankCode}:{accountNumber: string, bankCode: string}){
        try {
           const response = await lastValueFrom( this.HttpService.get(`https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
            {
                headers: {
                    'Authorization':`Bearer ${process.env.PAYSTACK_SECRET_KEY}`
                }
            }
          ));
            return response.data;
        } catch(error){
            console.log({error: error.message});
        }
    }

    findLevenshteinDistanceBeteenStrings(str1: string, str2: string): number{
        const track = Array(str2.length + 1).fill(null).map(() =>
        Array(str1.length + 1).fill(null));
        for (let i = 0; i <= str1.length; i++) {
           track[0][i] = i;
        }
        for (let j = 0; j <= str2.length; j++) {
           track[j][0] = j;
        }
        for (let j = 1; j <= str2.length; j++) {
           for (let i = 1; i <= str1.length; i++) {
              const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
              track[j][i] = Math.min(
                 track[j][i - 1] + 1, // deletion
                 track[j - 1][i] + 1, // insertion
                 track[j - 1][i - 1] + indicator, // substitution
              );
           }
        }
        return track[str2.length][str1.length];
    }
}