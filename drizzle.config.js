console.log(process.env.NEXT_PUBLIC_DATABASE_URL);

export default {
    dialect:"postgresql",
    schema: './utils/schema.js',
    out:'./drizzle',
    dbCredentials: {
        url: process.env.NEXT_PUBLIC_DATABASE_URL,
        connectionStrings: process.env.NEXT_PUBLIC_DATABASE_URL,
    },
};