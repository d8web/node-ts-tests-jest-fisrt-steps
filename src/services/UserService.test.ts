import { User, UserInstance } from '../models/User';
import * as UserService from './UserService';

describe('Testing user service', () => {

    let email = 'teste@jest.com';
    let password = '1234';

    // Antes de qualquer teste, sincronize o banco de dados
    beforeAll( async () => {
        // Função do model sync({ force: true }), faz a sincronização da estrutura do model com o que está no database.
        // Se existir essa tabela ele deleta por completo incluindo os dados nela presentes.
        // Se não existir a estrutura do model no database ele age como um migration e o sequelize cria a tabela no database.
        await User.sync({ force: true });
    });

    it('Criar um novo usuário no banco de dados', async () => {
        const newUser = await UserService.createUser(email, password) as UserInstance;
        expect(newUser).not.toBeInstanceOf(Error); // Espere que o novo usuário não seja uma instancia da classe Error
        expect(newUser).toHaveProperty('id'); // Verificar se o novo usuário possui a propriedade 'id'
        expect(newUser.email).toBe(email);
    });

    it('Não criar um novo usuário quando o email existir', async () => {
        const newUser = await UserService.createUser(email, password);
        expect(newUser).toBeInstanceOf(Error);
    });

    it('Encontrar um usuário pelo email', async () => {
        const user = await UserService.findByEmail(email) as UserInstance;
        expect(user.email).toBe(email); // O email do usuário encontrado tem que ser o mesmo que eu mandei, test ok!
    });

    it('Verificar se a senha do usuário é igual a senha no banco de dados', async () => {
        const user = await UserService.findByEmail(email) as UserInstance;
        const match = UserService.matchPassword(password, user.password);
        expect(match).toBeTruthy(); // Verificar se é verdadeiro com o match toBeTruThy() 
    });

    it('Verificar se a senha do usuário não é igual a senha no banco de dados', async () => {
        const user = await UserService.findByEmail(email) as UserInstance;
        const match = UserService.matchPassword('invalid', user.password);
        expect(match).toBeFalsy(); // Verificar se é falso com o match toBeFalsy() 
    });

    it('Pegar a lista de usuários', async () => {
        let users = await UserService.all();
        expect(users.length).toBeGreaterThanOrEqual(1);
        for(let i in users) {
            expect(users[i]).toBeInstanceOf(User); // Todo usuário deve ser uma instância do model User
        }
    });

});