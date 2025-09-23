import {
  IsISO31661Alpha2,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
} from "class-validator";
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("weather")
export class Weather {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  cityName: string;

  @Column()
  @IsISO31661Alpha2()
  @IsNotEmpty()
  country: string;

  @Column("float")
  @IsNumber()
  temperature: number;

  @Column()
  @IsString()
  @IsNotEmpty()
  description: string;

  @Column("int")
  @IsNumber()
  @Min(0)
  @Max(100)
  humidity: number;

  @Column("float")
  @IsNumber()
  @Min(0)
  windSpeed: number;

  @Column({ type: "timestamp" })
  fetchedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Index()
  @Column()
  cityCountry: string;
}
