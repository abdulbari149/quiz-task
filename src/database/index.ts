import { QuizEntity } from './../entities/quiz.entity';
import { OptionEntity } from './../entities/option.entity';
import { QuestionEntity } from './../entities/question.entity';
import { DataSource } from "typeorm";
import { SqlInMemory } from 'typeorm/driver/SqlInMemory';

const dataSource = new DataSource({
	type: "better-sqlite3",
	database: "sqlite:/quiz.db",
	entities: [QuestionEntity, OptionEntity, QuizEntity],
	migrations: ["src/migrations/*.ts"],
	dropSchema: false,
	prepareDatabase(db) {
			console.log(db)
	},
	synchronize: false,
	logging: true,
});
(async () => {
	await dataSource.initialize()
	// await dataSource.synchronize(true)
})()
export default dataSource;
