const express = require('express');
const { criarConteiner, listarConteiners, atualizarConteiner, deletarConteiner } = require('../controladores/conteiner');
const { criarMovimentacao, listarMovimentacoes, atualizarMovimentacao, deletarMovimentacao } = require('../controladores/movimentacoes');
const { relatorioTotalCliente, relatorioGeral } = require('../controladores/relatorio');


const rotas = express();
//conteiner
rotas.post('/conteiner', criarConteiner);
rotas.get('/conteiner', listarConteiners);
rotas.put('/conteiner/:id', atualizarConteiner);
rotas.delete('/conteiner/:id', deletarConteiner);

//movimentacoes
rotas.post('/movimentacoes', criarMovimentacao);
rotas.get('/movimentacoes', listarMovimentacoes);
rotas.put('/movimentacoes/:id', atualizarMovimentacao);
rotas.delete('/movimentacoes/:id', deletarMovimentacao);

//relatorios
rotas.get('/relatorio/:id', relatorioTotalCliente);
rotas.get('/relatorio', relatorioGeral);


module.exports = rotas;