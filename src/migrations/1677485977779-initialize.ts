import { MigrationInterface, QueryRunner } from "typeorm";

export class initialize1677485977779 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "quizes" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "description" text NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')))`
		);
		await queryRunner.query(
			`CREATE TABLE "questions" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "question" text NOT NULL, "is_mandatory" boolean NOT NULL DEFAULT (0), "quiz_id" integer NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), FOREIGN KEY ("quiz_id") REFERENCES quizes("id"));`
		);



		await queryRunner.query(`
        CREATE TABLE "options" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "question" text NOT NULL, "is_correct" boolean NOT NULL, "question_id" integer NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), FOREIGN KEY ("question_id") REFERENCES questions("id"))`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {}
}
