import { ObjectLiteral, Repository } from 'typeorm';

export class StatsHelper<T extends ObjectLiteral> {
  private createdAtColumn: string;
  private deleteColumn: string | null = null; 
  private hasDeletedField: boolean;          

  constructor(private repo: Repository<T>) {
    // ===== 1. createdAt =====
    const createdAtMeta = this.repo.metadata.columns.find(
      col => col.propertyName === 'createdAt'
    );

    if (!createdAtMeta) {
      throw new Error(
        `Entity ${this.repo.metadata.tableName} không có trường createdAt`
      );
    }

    this.createdAtColumn = createdAtMeta.databaseName;

    // ===== 2. isDeleted (entity property) =====
    const deletedMeta = this.repo.metadata.columns.find(
      col => col.propertyName === 'isDeleted'
    );

    this.hasDeletedField = !!deletedMeta;

    if (deletedMeta) {
      // Tên cột DB (is_deleted)
      this.deleteColumn = deletedMeta.databaseName;
    }
  }

  async countTotal(): Promise<number> {
    if (this.hasDeletedField) {
      return this.repo.count({
        where: { isDeleted: 0 } as any,
      });
    }

    return this.repo.count();
  }

  async countByMonth(year: number): Promise<number[]> {
    const table = this.repo.metadata.tableName;

    const whereDelete =
      this.hasDeletedField && this.deleteColumn
        ? `AND ${this.deleteColumn} = 0`
        : ``;

    const raw = await this.repo.query(
      `
      SELECT 
        MONTH(${this.createdAtColumn}) AS month,
        COUNT(*) AS count
      FROM ${table}
      WHERE YEAR(${this.createdAtColumn}) = ?
      ${whereDelete}
      GROUP BY MONTH(${this.createdAtColumn})
      ORDER BY MONTH(${this.createdAtColumn})
      `,
      [year],
    );

    const result = Array(12).fill(0);
    raw.forEach(r => (result[r.month - 1] = Number(r.count)));
    return result;
  }
}
