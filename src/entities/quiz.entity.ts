import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { QuestionEntity } from "./question.entity";

@Entity("quizes")
export class QuizEntity extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: "varchar", name: "title", nullable: false })
	title: string;

	@Column({ type: "text", name: "description", nullable: false })
	description: string;

  @OneToMany(() => QuestionEntity, (question) => question.quiz)
  questions: QuestionEntity[]

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt: Date
}


