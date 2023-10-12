import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Criptomoeda {

    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    nome: string;

    @Column()
    moeda: string;

    @Column()
    valor: number;

    @Column()
    @CreateDateColumn()
    data?: Date;
}