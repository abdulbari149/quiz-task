import { OptionEntity } from "./option.entity";
import { QuizEntity } from "./quiz.entity";
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	BaseEntity,
	ManyToOne,
	JoinColumn,
	OneToMany,
	CreateDateColumn,
	UpdateDateColumn,
} from "typeorm";

@Entity("questions")
export class QuestionEntity extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: "text", name: "question", nullable: false })
	question: string;

	@Column({
		type: "boolean",
		name: "is_mandatory",
		nullable: false,
		default: false,
	})
	isMandatory: boolean;

	@Column({
		type: "integer",
		name: "quiz_id",
		nullable: false,
	})
	quizId: number;

	@OneToMany(() => OptionEntity, (option) => option.question)
	options: OptionEntity[];

	@ManyToOne(() => QuizEntity, (quiz) => quiz.questions, {
		eager: true,
		onDelete: "CASCADE",
	})
	@JoinColumn({ name: 'quiz_id' , referencedColumnName: "id" })
	quiz: QuizEntity;

	@CreateDateColumn({ name: "created_at" })
	createdAt: Date;

	@UpdateDateColumn({ name: "updated_at" })
	updatedAt: Date;
}
