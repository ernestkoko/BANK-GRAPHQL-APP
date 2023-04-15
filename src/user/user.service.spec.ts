import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { HttpService } from '@nestjs/axios';
import { FindUserInput } from './dto/find-user.input';
import { ValidateAccountInput } from './dto/validate-account.input';
import { Repository } from 'typeorm';

describe('UserService', ()=>{
    const user: User = {
        id: 'rtryyyur',
        account_name: 'Ernest Eferetin',
        account_number: '2061600222',
        bank_code: '033',
        verified: true
            
    }
    let userService: UserService;
    let userRepository: Repository<User>;
    const mockUserRepository = {
        findOne: jest.fn().mockResolvedValue(user),
        save: jest.fn()
    }
    const mockHttpService = {
        get: jest.fn()
    }
    beforeAll(async ()=>{
        const module: TestingModule = await Test.createTestingModule({
            providers:[
                UserService,
                {
                    provide: getRepositoryToken(User),
                    useValue: mockUserRepository
                },
                {
                    provide: HttpService,
                    useValue: mockHttpService
                }
            ],
        }).compile();
        userService = module.get<UserService>(UserService);
        userRepository = module.get(getRepositoryToken(User));
    })

    it('UserService should be defined', () => {
        expect(userService).toBeDefined();
      });

    describe('GetUserName', ()=>{
        const dto: FindUserInput = {
            user_account_number: '366399930',
            user_bank_code: '033'
        } 
        it('getUserName succeed', async () => {
            const getUserName = jest.spyOn(userService, 'getUserName').mockImplementation(async ()=> await Promise.resolve('Er'));
            jest.spyOn(userService, 'validatePaystackName').mockResolvedValue({
                data: {
                    account_name: "Ernest"
                }
            });
            expect(getUserName).toBeDefined();
            await userService.getUserName(dto)
            expect(getUserName).toBeCalled();
            expect(getUserName).toHaveBeenCalledWith(dto);
        });
    })

    // describe('ValidateUserName', ()=>{
        const dto: ValidateAccountInput = {
            user_account_number: '2046477484',
            user_bank_code: '033',
            user_account_name: "Ernest Eferetin"
            
        } 
        it('validateAccountName succeed', async () => {
            //const validateAccountName = jest.spyOn(userService, 'validateAccountName').mockResolvedValue(user);
            jest.spyOn(userService, 'validatePaystackName').mockResolvedValue({
                data: {
                    account_name: "Ernest"
                }
            });
            jest.spyOn(userService, 'findLevenshteinDistanceBeteenStrings').mockImplementation(()=> 2);
           // expect(validateAccountName).toBeDefined();
            const data = await userService.validateAccountName(dto)
           // expect(validateAccountName).toBeCalled();
            //expect(validateAccountName).toHaveBeenCalledWith(dto);
            expect(await userService.validateAccountName(dto)).toEqual(user);
        });
        
        it('validateAccountName Fail', async () => {
            //const validateAccountName = jest.spyOn(userService, 'validateAccountName');
            jest.spyOn(userService, 'validatePaystackName').mockResolvedValue({
                data: {
                    account_name: "Ernest Eferetin"
                }
            });
            jest.spyOn(userService, 'findLevenshteinDistanceBeteenStrings').mockImplementation(()=> 3);
           
            const data = await userService.validateAccountName(dto)
            expect(data).toEqual({
                id: expect.any(String),
                account_name: expect.any(String),
                account_number: expect.any(String),
                bank_code: expect.any(String),
                verified: expect.any(Boolean)
               })
            // expect(validateAccountName).toBeCalled();
            // expect(validateAccountName).toHaveBeenCalledWith(dto);
            expect(data).toEqual(user);
        });
    // })
      
});
