import bcrypt from 'bcrypt';
import { User } from '../models/User';

export const createUser = async (email: string, password: string) => {
    const hasUser = await User.findOne({ where: { email } });

    if(!hasUser) {

        let hash = bcrypt.hashSync(password, 10); // Gerar hash com bcrypt,segundo parâmetro "salt"
        const newUser = await User.create({ // Criando novo usuário
            email,
            password: hash
        });
        return newUser;

    } else {
        return new Error('Email já existe!');
    }
}

export const findByEmail = async (email: string) => {
    return await User.findOne({ where: { email } });
}

export const matchPassword = (passwordText: string, encrypted: string) => {
    return bcrypt.compareSync(passwordText, encrypted);
}

export const all = async () => {
    return await User.findAll();
}