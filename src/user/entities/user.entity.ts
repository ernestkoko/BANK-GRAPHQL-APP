import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@ObjectType()
@Entity()
export class User{

    @Field({description: 'Unique id of the user that is auto-generated at the point of insertion.'})
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field({description: 'Account name of the user'})
    @Column()
    account_name: string;

    @Field({description: 'Account number of the user. It is unique'})
    @Column({
        unique: true
    })
    account_number: string;

    @Field({description: 'Bank code of the user'})
    @Column()
    bank_code: string;

    @Field(() => Boolean,{description: 'Flag that shows the user\'s status. It is true if the user has been verified else false'})
    @Column({
        default: false
    })
    verified: boolean;

}