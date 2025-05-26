import { MigrationInterface, QueryRunner } from "typeorm";

export class StandardTypes1748270420109 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO account_types (id, name)
            VALUES 
                (1, 'Corrente'),
                (2, 'Poupança'),
                (3, 'Crédito'),
                (4, 'Investimento'),
                (5, 'Salário'),
                (6, 'Pagamento'),
                (7, 'Empréstimo')
            ON CONFLICT (id) DO NOTHING
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM account_types
            WHERE id IN (1, 2, 3, 4, 5, 6, 7)
        `);
    }

}
