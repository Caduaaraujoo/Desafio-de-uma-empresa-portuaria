const conexao = require('../utilidades/conexao');
const { retornoRowCount } = require('../utilidades/rowCount');
const { retornoRows } = require('../utilidades/rows')


const relatorioTotalCliente = async (req, res) => {
    const { id } = req.params;
    try {
        const queryTotalMovimentacoes =
            ` select c.cliente_nome as cliente, count(*) as quantidade from movimentacoes m
          inner join conteiner c on m.cliente_id = c.id  
          where c.id = $1
          group by c.cliente_nome  
        `
        const relatorioCliente = await conexao.query(queryTotalMovimentacoes, [id]);

        const queryEspecificada =
            ` select c.cliente_nome as cliente, c.categoria as categoria, t.tipo as nome_movimentacao, count(*) as quantidade from movimentacoes m
        inner join conteiner c on m.cliente_id = c.id
        inner join tipos_movimentacoes t on m.tipo_movimentacao = t.id
        where c.id = $1
        group by c.cliente_nome, c.categoria, t.tipo
        `
        const relatorioEspecificado = await conexao.query(queryEspecificada, [id]);

        if (retornoRowCount(relatorioEspecificado)) {
            return res.status(400).json("Nenhum relatorio encontrado")
        }

        return res.status(200).json({
            "total de movimentações": retornoRows(relatorioCliente),
            "Movimentações Gerais": retornoRows(relatorioEspecificado)
        })

    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const relatorioGeral = async (req, res) => {
    try {
        const quantidadeGeral = await conexao.query(`select id as quantidade, count(*) from movimentacoes group by quantidade`);

        const relatorioTotalMovimentacoes = await conexao.query(`select c.cliente_nome as cliente, count(*) as quantidade from movimentacoes m
        inner join conteiner c on m.cliente_id = c.id
        group by c.cliente_nome`);

        const relatorioEspecificado = await conexao.query(`select c.cliente_nome as cliente, c.categoria as categoria, t.tipo as nome_movimentacao, count(*) as quantidade
        from movimentacoes m
        inner join conteiner c on m.cliente_id = c.id
        inner join tipos_movimentacoes t on m.tipo_movimentacao = t.id
        group by c.cliente_nome, t.tipo, c.categoria`);

        const relatorioGeral = await conexao.query(`select categoria, count(*) from conteiner group by categoria`);

        return res.status(200).json({
            "total_movi": quantidadeGeral.rowCount,
            "relatorio": retornoRows(relatorioTotalMovimentacoes),
            "especificado": retornoRows(relatorioEspecificado),
            "exportacao_importacao": retornoRows(relatorioGeral)
        })
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    relatorioTotalCliente,
    relatorioGeral
}