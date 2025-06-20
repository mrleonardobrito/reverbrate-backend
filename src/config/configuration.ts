type TimeUnit = {
    [key: string]: number;
};

const TIME_UNITS: TimeUnit = {
    ms: 1,
    s: 1000,
    m: 1000 * 60,
    h: 1000 * 60 * 60,
    d: 1000 * 60 * 60 * 24
};

function parseDuration(duration: string): number {
    if (!duration) {
        throw new Error('Duration must be provided');
    }

    const match = duration.match(/^(\d+)\s*(ms|s|m|h|d)$/);
    if (!match) {
        throw new Error('Invalid duration format. Expected format: number + unit (ms|s|m|h|d). Example: "5m" or "24h"');
    }

    const [, value, unit] = match;
    const valueNumber = parseInt(value, 10);
    const multiplier = TIME_UNITS[unit];

    if (isNaN(valueNumber) || valueNumber < 0) {
        throw new Error('Duration value must be a positive number');
    }

    return valueNumber * multiplier;
}

export default () => ({
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN || '1h',
        refreshSecret: process.env.JWT_REFRESH_SECRET,
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    },

    cookies: {
        accessToken: {
            name: 'access_token',
            maxAge: parseDuration(process.env.JWT_EXPIRES_IN || '1h'),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict' as const,
        },
        refreshToken: {
            name: 'refresh_token',
            maxAge: parseDuration(process.env.JWT_REFRESH_EXPIRES_IN || '7d'),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict' as const,
        },
    },

    spotify: {
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    },

    database: {
        url: process.env.DATABASE_URL,
    },

    server: {
        port: parseInt(process.env.PORT || '3000', 10),
        environment: process.env.NODE_ENV || 'development',
    },

    security: {
        cors: {
            origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
            credentials: true,
        },
        rateLimit: {
            windowMs: parseDuration(process.env.RATE_LIMIT_WINDOW_MS || '15m'),
            max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
        },
    },
}); 