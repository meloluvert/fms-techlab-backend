import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUsersTable1747836646569 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "users",
                columns: [
                    {
                        name: "id",
                        type: "BIGINT",
                        isPrimary: true,
                        generationStrategy: "increment",
                        isNullable: false,
                        
                    },
                    {
                        name: "email",
                        type: "VARCHAR",
                        length: '40',
                        isUnique: false,
                        isNullable: false
                    },
                    {
                        name: "name",
                        type: "VARCHAR",
                        isNullable: false,
                        length: '100'
                    },
                    {
                        name: 'password',
                        type: "VARCHAR",
                        isNullable: false,
                        length: '255'
                    },
                    {
                        name: "created_at",
                        type: "DATETIME",
                        isNullable: false,

                    },
                    {
                        name: "updated_at",
                        type: "DATETIME",
                        isNullable: false,
                    }
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('users')
    }

}
