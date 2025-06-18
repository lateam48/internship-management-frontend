function getEnvVar(name: string) {
    const value = process.env[name];
    if (!value || value.trim() === "") {
        throw new Error(`Environment variable ${name} is missing or empty.`);
    }
    return value;
}

const envConfig = {
    baseUrl: "BASE_URL",
    authUrl: "NEXTAUTH_URL",
    apiUrl: "NEXT_PUBLIC_API_URL",
    authSecret: "NEXTAUTH_SECRET",
};

type getEnvtype = Record<keyof typeof envConfig, string>;

function getEnv(): getEnvtype {
    const result: Partial<getEnvtype> = {};
    for (const [key, envName] of Object.entries(envConfig)) {
        result[key as keyof typeof envConfig] = getEnvVar(envName);
    }
    return result as getEnvtype;
}

export default getEnv;
