import request from 'supertest';
import app from '../app';
import { User } from '../models/User';

describe('Testando rotas da api', () => {

    let email = 'teste@jest.com';
    let password = '1234';

    beforeAll(async() => {
        await User.sync({ force: true }); // Antes de tudo sincronizamos com o model User no banco de dados.
    });

    it('Rota Ping Pong', (done) => {
        request(app)
            .get('/ping')
            .then(response => {
                expect(response.body.pong).toBeTruthy(); // Espere no corpo da resposta o pong => true;
                return done() // Para o teste
            });
    });

    it('Rota registrar um novo usuário', (done) => {
        request(app)
            .post('/register')
            .send(`email=${email}&password=${password}`)
            .then(response => {
                expect(response.body.error).toBeUndefined(); // Se o erro veio undefined, significa que não deu erro, tudo certo.
                expect(response.body).toHaveProperty('id'); // Se não deu erro, veio a propriedade id, verificamos isso tbm. toHaveProperty(), matche que verifica se o existe essa propriedade
                return done() // Para o teste
            });
    });

    it('Rota não deve permitir adicionar um usuário com o mesmo email', (done) => {
        request(app)
            .post('/register')
            .send(`email=${email}&password=${password}`)
            .then(response => {
                expect(response.body.error).not.toBeUndefined(); // Verificar se o erro existe e não é undefined
                return done() // Para o teste
            });
    });

    it('Rota não deve permitir adicionar um usuário sem mandar a senha', (done) => {
        request(app)
            .post('/register')
            .send(`email=${email}`)
            .then(response => {
                expect(response.body.error).not.toBeUndefined(); // Verificar se o erro existe e não é undefined
                return done() // Para o teste
            });
    });

    it('Rota não deve permitir adicionar um usuário sem mandar o email', (done) => {
        request(app)
            .post('/register')
            .send(`password=${password}`)
            .then(response => {
                expect(response.body.error).not.toBeUndefined(); // Verificar se o erro existe e não é undefined
                return done() // Para o teste
            });
    });

    it('Rota não deve permitir adicionar um usuário sem mandar nada', (done) => {
        request(app)
            .post('/register')
            .send(``)
            .then(response => {
                expect(response.body.error).not.toBeUndefined(); // Verificar se o erro não é undefined [.not.toBeUndefined()]
                return done() // Para o teste
            });
    });

    it('Rota fazer login', (done) => {
        request(app)
            .post('/login')
            .send(`email=${email}&password=${password}`)
            .then(response => {
                expect(response.body.error).toBeUndefined(); // Verificar se o erro é undefined
                expect(response.body.status).toBeTruthy();
                return done() // Para o teste
            });
    });

    it('Rota fazer login com dados incorretos', (done) => {
        request(app)
            .post('/login')
            .send(`email=${email}&password=invalid`)
            .then(response => {
                expect(response.body.error).toBeUndefined(); // Verificar se o erro é undefined
                expect(response.body.status).toBeFalsy();
                return done() // Para o teste
            });
    });

    it('Rota Listar todos usuários', (done) => {
        request(app)
            .get('/list')
            .then(response => {
                expect(response.body.error).toBeUndefined(); // Verificar se o erro é undefined
                expect(response.body.list.length).toBeGreaterThanOrEqual(1); // Verificar se tem pelo menos um item nessa lista
                expect(response.body.list).toContain(email) // Verifica se o email contém nessa lista
                return done() // Para o teste
            });
    });

});