import HttpException from "../utils/HttpException";
import { OptionEntity } from "./../entities/option.entity";
import { QuestionEntity } from "./../entities/question.entity";
import { QuizEntity } from "../entities/quiz.entity";
import { plainToInstance } from "class-transformer";
import { QueryRunner } from "typeorm";
import dataSource from "../database";

interface ICreateQuiz {
	title: string;
	description: string;
}

interface IOption {
	option: string;
	isCorrect: boolean;
}

export interface IAddQuestionToQuiz {
	quizId: number;
	question: string;
	isMandatory: boolean;
	options: Array<IOption>;
}

interface DBOptions {
	queryRunner: QueryRunner;
}

export const createQuiz = async (
	data: ICreateQuiz,
	{ queryRunner }: DBOptions
) => {
	const quizEntity = plainToInstance(QuizEntity, data);
	const quiz = await queryRunner.manager.findOne(QuizEntity, {
		where: { title: data.title },
	});
	if (quiz) return quiz;
	return await queryRunner.manager.save<QuizEntity>(quizEntity);
};

export interface IAddQuestionToQuizReturn {
	question: QuestionEntity;
	options: OptionEntity[];
}
export const addQuestionToQuiz = async (
	data: IAddQuestionToQuiz,
	{ queryRunner }: DBOptions
): Promise<IAddQuestionToQuizReturn> => {
	const qustionEntity = plainToInstance(QuestionEntity, {
		question: data.question,
		isMandatory: data.isMandatory,
		quizId: data.quizId,
	});
	const question = await queryRunner.manager.save(qustionEntity);

	const optionsEntity = plainToInstance(
		OptionEntity,
		data.options.map((option) => ({ ...option, questionId: question.id }))
	);
	const options = await queryRunner.manager.save(optionsEntity);

	return {
		question,
		options,
	};
};

export const getQuizWithDetails = async (id: number) => {
	const quizRepository = dataSource.getRepository(QuizEntity);
	const questionRepository = dataSource.getRepository(QuestionEntity);
	const quiz = await quizRepository.findOne({ where: { id } });

	if (!quiz) {
		throw new HttpException("Quiz not found", 404, [1002]);
	}
	const questions = await questionRepository.find({
		where: { quizId: quiz.id },
		relations: { options: true },
		select: {
			id: true,
			question: true,
			isMandatory: true,
			createdAt: true,
			updatedAt: true,
			options: {
				id: true,
				option: true,
				isCorrect: true,
				createdAt: true,
				updatedAt: true,
			},
		},
		loadEagerRelations: false,
	});
	return {
		...quiz,
		questions,
	};
};
