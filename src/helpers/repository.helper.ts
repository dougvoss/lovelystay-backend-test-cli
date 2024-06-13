import db from '../db';

function returningFieldsToSql(returningFields: string[]): string {
  return returningFields.length
    ? `RETURNING ${returningFields.join(', ')}`
    : '';
}

function conflictFieldsToSql(conflictFields: string[], keys: string[]): string {
  let onConflictStrSql = '';
  if (conflictFields.length) {
    onConflictStrSql = `ON CONFLICT (${conflictFields.join(', ')}) 
    DO UPDATE SET `;

    keys.forEach((key, index) => {
      onConflictStrSql += `${key} = EXCLUDED.${key}`;
      if (index < keys.length - 1) onConflictStrSql += ', ';
    });
  }

  return onConflictStrSql;
}

async function upsertOne<T>({
  table,
  data,
  conflictFields = [],
  returningFields = []
}: {
  table: string;
  data: T;
  conflictFields?: string[];
  returningFields?: string[];
}): Promise<any> {
  try {
    const keys = Object.keys(data as any);

    const returningStr = returningFieldsToSql(returningFields);
    const onConflictStrSql = conflictFieldsToSql(conflictFields, keys);

    const values = keys.map((key) => `$[${key}]`);

    const sql = `INSERT INTO "${table}" (${keys.join(', ')}) 
      VALUES (${values.join(', ')}) ${onConflictStrSql} ${returningStr}`;

    const result = await db.one(sql, data);
    return result;
  } catch (error: any) {
    throw new Error(`Error on try to insert data. Cause: ${error.message}`);
  }
}

export default {
  upsertOne
};
