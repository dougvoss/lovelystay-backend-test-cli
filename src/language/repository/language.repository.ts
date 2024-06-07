import db from "../../db";

export const createLanguage = async (
  userId: number,
  language: string
): Promise<string> => {
  try {
    const created = await db.one(
      `INSERT INTO languages (user_id, language) VALUES ($1, $2) RETURNING id`,
      [userId, language]
    );

    return created.id;
  } catch (error: any) {
    throw new Error(
      `Error on try to insert language data. Cause: ${error.message}`
    );
  }
};

export const createLanguages = async (userId: number, languages: string[]) => {
  const promises: any[] = [];

  languages.forEach((language) => {
    promises.push(createLanguage(userId, language));
  });

  const ids = await Promise.all(promises);

  return ids;
};
