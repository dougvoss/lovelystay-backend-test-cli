import db from "../../db";

export const createUser = async (user: IUser): Promise<number> => {
  try {
    const created = await db.one(
      `INSERT INTO users (
        name, 
        location, 
        followers, 
        following, 
        created_at
      ) VALUES (
        $1, $2, $3, $4, $5
      ) RETURNING id`,
      [user.name, user.location, user.followers, user.following, user.createdAt]
    );

    return created.id;
  } catch (error: any) {
    throw new Error(
      `Error on try to insert user data. Cause: ${error.message}`
    );
  }
};

export const findUsers = async (filter?: string): Promise<IUser[]> => {
  try {
    const filterParams: any[] = [];
    let where = "";

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
      FROM users as u 
      LEFT JOIN languages as l ON l.user_id = u.id
      ${where}
      GROUP BY u.id
    `;

    const rows: any[] = await db.any(sql, filterParams);

    return rows.map((row) => {
      const user: IUser = {
        id: row.id,
        name: row.name,
        location: row.location,
        followers: row.followers,
        following: row.following,
        languages: row.languages,
        createdAt: row.created_at,
      };
      return user;
    });
  } catch (error: any) {
    throw new Error(`Error on try to list users. Cause: ${error.message}`);
  }
};
