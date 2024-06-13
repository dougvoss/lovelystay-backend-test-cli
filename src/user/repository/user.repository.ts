import _repositoryHelper from '../../helpers/repository.helper';
import db from '../../db';
import { IUser } from '../interface/IUser';

export const upsertUser = async (user: IUser): Promise<number> => {
  try {
    const result = await _repositoryHelper.upsertOne<IUser>({
      table: 'user',
      data: user,
      conflictFields: ['username'],
      returningFields: ['id']
    });

    return result.id;
  } catch (error: any) {
    throw new Error(`Error on try to upsert user. Cause: ${error.message}`);
  }
};

export const findUsers = async (filter?: string): Promise<IUser[]> => {
  try {
    const filterParams: any[] = [];
    let where = '';

    if (filter) {
      where = `
        WHERE 
          UPPER(l.language) = UPPER($1) 
          OR UPPER(u.location) = UPPER($1)`;

      filterParams.push(filter);
    }
    const sql = `
      SELECT DISTINCT 
          u.*,
          COALESCE(STRING_AGG(l.language, ', '), '') as languages
      FROM "user" as u 
      LEFT JOIN "language" as l ON l.user_id = u.id
      ${where}
      GROUP BY u.id
    `;

    const rows: any[] = await db.any(sql, filterParams);

    return rows.map((row) => {
      const user: IUser = {
        id: row.id,
        username: row.username,
        name: row.name,
        location: row.location,
        followers: row.followers,
        following: row.following,
        languages: row.languages,
        created_at: row.created_at
      };
      return user;
    });
  } catch (error: any) {
    throw new Error(`Error on try to list users. Cause: ${error.message}`);
  }
};
