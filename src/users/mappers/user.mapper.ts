import { User } from '../entities/user.entity';

export class UserMapper {
    static toDTO(user: User) {
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image
        };
    }

    static toDomain(raw: {
        id: string;
        email: string;
        name: string;
        image: string;
    }): User {
        return User.create({
            id: raw.id,
            email: raw.email,
            name: raw.name,
            image: raw.image,
        });
    }
} 