import './style.css'
import api from '../../servicos/api'
import { useEffect, useState } from 'react'

export default function Relatorio() {
    const [totalMovi, setTotalMovi] = useState(0);
    const [relatorioEspecificado, setRelatorioEspecificado] = useState([]);
    const [exportacao, setExportacao] = useState([]);
    const [importacao, setImportacao] = useState([]);

    useEffect(() => {
        async function dados() {
            const response = await api.get('/relatorio');
            setTotalMovi(response.data.total_movi);
            setRelatorioEspecificado(response.data.especificado);
            setExportacao(response.data.exportacao_importacao[0]);
            setImportacao(response.data.exportacao_importacao[1]);
        }

        dados();
    }, []);

    return (
        <div className='conteiner'>
            <h1>Tabela de Movimentações</h1>
            <div className='total-movi'>
                <h1>Total de Movimentações: </h1>
                <h1>{totalMovi}</h1>
            </div>
            <div className='row'>
                <div className='tabela'>
                    <table>
                        <thead>
                            <tr>
                                <th>Cliente</th>
                                <th>Nome da Movimentação</th>
                                <th>Quantidade</th>
                                <th>Categoria</th>
                            </tr>

                        </thead>
                        {relatorioEspecificado.map((dados) => (
                            <tbody>
                                <tr>
                                    <td>{dados.cliente}</td>
                                    <td>{dados.nome_movimentacao}</td>
                                    <td>{dados.quantidade}</td>
                                    <td>{dados.categoria}</td>
                                </tr>
                            </tbody>
                        ))}

                    </table>
                </div>
                <div className='total-ex-im'>
                    <div className='exportacao'>
                        <h1>{exportacao.categoria}:</h1>
                        <h1>{exportacao.count}</h1>
                    </div>
                    <div className='importacao'>
                        <h1>{importacao.categoria}:</h1>
                        <h1>{importacao.count}</h1>
                    </div>

                    <strong></strong>
                    <button>Ir para a tabela de Exportações e Importações</button>
                </div>
            </div>
        </div>
    )
}