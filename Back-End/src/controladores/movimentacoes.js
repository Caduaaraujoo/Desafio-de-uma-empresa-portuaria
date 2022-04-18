const conexao = require('../utilidades/conexao');
const { retornoRowCount } = require('../utilidades/rowCount');
const { retornoRows } = require('../utilidades/rows');

const criarMovimentacao = async (req, res) => {
    const { cliente_id, tipo_movimentacao, data_hora_inicio, data_hora_fim } = req.body

    if (!cliente_id || !tipo_movimentacao || !data_hora_inicio || !data_hora_fim) {
        return res.status(400).json("Todos os campos são obrigatórios");
    }

    const localizarCliente = await conexao.query(`select * from conteiner where id = $1`, [cliente_id]);
    if (retornoRowCount(localizarCliente)) {
        return res.status(400).json("O cliente não cadastrado");
    }

    try {
        const query = `insert into movimentacoes (cliente_id, tipo_movimentacao, data_hora_inicio, data_hora_fim) values($1, $2, $3, $4)`;
        const cadastrarMovimentacao = await conexao.query(query, [cliente_id, tipo_movimentacao, data_hora_inicio, data_hora_fim]);

        if (retornoRowCount(cadastrarMovimentacao)) {
            return res.status(400).json("Não foi possivel cadastrar a movimentação");
        }

        return res.status(201).json("Movimentação cadastrada com sucesso");
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const listarMovimentacoes = async (req, res) => {
    try {
        const movimentacoes = await conexao.query(`select * from movimentacoes`);

        return res.status(200).json(retornoRows(movimentacoes));
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const atualizarMovimentacao = async (req, res) => {
    const { id } = req.params;
    const { data_hora_inicio, data_hora_fim } = req.body;

    if (!data_hora_inicio || !data_hora_fim) {
        return res.status(400).json("Data e hora de inicio e fim, são obrigatórios");
    }

    try {
        const movimentacao = await conexao.query(`select * from movimentacoes where id = $1`, [id]);
        if (retornoRowCount(movimentacao)) {
            return res.status(400).json("Movimentação não localizada");
        }
        const query = `update movimentacoes set data_hora_inicio = $1, data_hora_fim = $2 where id = $3`;
        const atualizarMovimentacao = await conexao.query(query, [data_hora_inicio, data_hora_fim, id]);

        if (retornoRowCount(atualizarMovimentacao)) {
            return res.status(400).json("Não foi possivel atualizar a movimentação");
        }

        return res.status(200).json("Movimentação atualizada com sucesso");
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const deletarMovimentacao = async (req, res) => {
    const { id } = req.params

    try {
        const movimentacao = await conexao.query(`select * from movimentacoes where id = $1`, [id]);
        if (retornoRowCount(movimentacao)) {
            return res.status(400).json("Movimentação não localizada");
        }
        const deleteMovimentacao = await conexao.query(`delete from movimentacoes where id = $1`, [id]);
        if (retornoRowCount(deleteMovimentacao)) {
            return res.status(400).json("Não foi possivel excluir a movimentação");
        }
        return res.status(200).json("Movimentação excluida com sucesso");
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    criarMovimentacao,
    listarMovimentacoes,
    atualizarMovimentacao,
    deletarMovimentacao
}