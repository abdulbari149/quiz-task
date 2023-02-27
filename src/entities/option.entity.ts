import { QuestionEntity } from "./question.entity";
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	BaseEntity,
	ManyToOne,
	JoinColumn,
	CreateDateColumn,
	UpdateDateColumn,
} from "typeorm";

@Entity("options")
export class OptionEntity extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: "text", name: "question", nullable: false })
	option: string;

	@Column({ type: "boolean", name: "is_correct", nullable: false })
	isCorrect: boolean;

	@Column({ type: "integer", name: "question_id", nullable: false })
	questionId: number;

	@ManyToOne(() => QuestionEntity, (question) => question.options, {
		eager: true,
		onDelete: "CASCADE",
	})
	@JoinColumn({  name: 'question_id', referencedColumnName: "id" })
	question: QuestionEntity;

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt: Date
}
