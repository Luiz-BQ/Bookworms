const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname)));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'senha',
    database: 'Bookworms'
});
db.connect((erro) => {
    if (erro) {
        console.error('Erro ao conectar ao MySQL:', erro);
        return;
    }
    console.log('Conectado com sucesso ao MySQL');
});
app.post('/cadastro', async (req, res) => {
    try {
        const { nome, nascimento, email, senha } = req.body;
        const saltRounds = 10;
        const senhaHash = await bcrypt.hash(senha, saltRounds);

        const sql = 'INSERT INTO usuarios (nome, data_nascimento, email, senha_hash) VALUES (?, ?, ?, ?)';
        
        db.query(sql, [nome, nascimento, email, senhaHash], (erro, resultado) => {
            if (erro) {
                if (erro.code === 'ER_DUP_ENTRY') {
                    return res.status(400).send('Este e-mail já está cadastrado.');
                }
                return res.status(500).send('Erro ao salvar no banco de dados.');
            }
            res.redirect('/login.html');
        });

    } catch (erro) {
        res.status(500).send('Erro interno no servidor.');
    }
});
app.post('/login', (req, res) => {
    const { email, senha } = req.body;

    const sql = 'SELECT * FROM usuarios WHERE email = ?';
    
    db.query(sql, [email], async (erro, resultados) => {
        if (erro) return res.status(500).send('Erro no servidor.');
        
        if (resultados.length === 0) {
            return res.status(400).send('E-mail ou senha incorretos.');
        }

        const usuario = resultados[0];

        const senhaCorreta = await bcrypt.compare(senha, usuario.senha_hash);

        if (senhaCorreta) {
            res.redirect('/livros.html');
        } else {
            res.status(400).send('E-mail ou senha incorretos.');
        }
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});