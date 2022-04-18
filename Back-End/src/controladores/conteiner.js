const conexao = require('../utilidades/conexao');
const { validarFormato } = require('../utilidades/validarNumero');
const { retornoRowCount } = require('../utilidades/rowCount');
const { retornoRows } = require('../utilidades/rows')

const criarConteiner = async (req, res) => {
    const { cliente_nome, numero_conteiner, tipo, status, categoria } = req.body

    numero_conteiner.toUpperCase()
    if (numero_conteiner.length !== 11) {
        return res.status(400).json("O numero do conteiner deve ter 11 caracteres");
    }

    if (!validarFormato(numero_conteiner)) {
        return res.status(400).json("O padrão de número do conteiner deve ser TEST1234567");
    }

    if (!cliente_nome || !numero_conteiner || !tipo || !status || !categoria) {
        return res.status(400).json("Todos os campos são obrigatórios");
    }

    const numeroExistente = await conexao.query(`select * from conteiner where numero_conteiner = $1`, [numero_conteiner]);

    if (!retornoRowCount(numeroExistente)) {
        return res.status(400).json("Numero de conteiner já existente");
    }

    try {
        const query = `insert into conteiner (cliente_nome, numero_conteiner, tipo, status, categoria)
         values($1, $2, $3, $4, $5)`

        const conteiner = await conexao.query(query, [cliente_nome, numero_conteiner, tipo, status, categoria]);

        if (retornoRowCount(conteiner)) {
            return res.status(400).json("Não foi possivel cadastrar o conteiner");
        }

        return res.status(201).json("Conteiner cadastrado com sucesso");
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const listarConteiners = async (req, res) => {
    try {
        const conteiners = await conexao.query(`select * from conteiner order by id`);

        return res.status(200).json(retornoRows(conteiners));
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const atualizarConteiner = async (req, res) => {
    const { cliente_nome, tipo, status, categoria } = req.body;
    const { id } = req.params;

    if (!cliente_nome || !tipo || !status || !categoria) {
        return res.status(400).json("Todos os campos são obrigatórios");
    }

    try {
        const conteiner = await conexao.query(`select * from conteiner where id = $1`, [id]);
        if (retornoRowCount(conteiner)) {
            return res.status(400).json("Conteiner não localizado");
        }

        const query = `update conteiner set cliente_nome = $1, tipo = $2, status = $3, categoria = $4 where id = $5`;
        const conteinerAtualizado = await conexao.query(query, [cliente_nome, tipo, status, categoria, id]);
        if (retornoRowCount(conteinerAtualizado)) {
            return res.status(400).json("Não foi possivel atualizar o conteiner");
        }

        return res.status(200).json("Conteiner atualizado com sucesso");

    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const deletarConteiner = async (req, res) => {
    const { id } = req.params;

    try {
        const conteiner = await conexao.query(`select * from conteiner where id = $1`, [id]);
        if (retornoRowCount(conteiner)) {
            return res.status(400).json("Conteiner não localizado");
        }

        const limparMovimentacoes = await conexao.query(`delete from movimentacoes where cliente_id = $1`, [id]);

        const query = `delete from conteiner where id = $1`
        const deletarConteiner = await conexao.query(query, [id]);

        if (retornoRowCount(deletarConteiner)) {
            return res.status(400).json("Não foi possivel excluir o conteiner");
        }

        return res.status(200).json("Conteiner foi excluido com sucesso");

    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    criarConteiner,
    listarConteiners,
    atualizarConteiner,
    deletarConteiner
}