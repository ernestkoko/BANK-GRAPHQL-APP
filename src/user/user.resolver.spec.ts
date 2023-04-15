import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';

describe('UserResolver', ()=>{
    let userResolver: UserResolver;
    const mockUserService = {

    }
    beforeAll(async ()=>{
        const module: TestingModule = await Test.createTestingModule({
            providers:[
                UserResolver,
                {
                    provide: UserService,
                    useValue: mockUserService
                }
            ],
        }).compile();
        userResolver = module.get<UserResolver>(UserResolver);
    })

    it('UserService should be defined', () => {
        expect(userResolver).toBeDefined();
      });
});
