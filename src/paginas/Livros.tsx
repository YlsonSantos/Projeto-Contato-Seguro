import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@radix-ui/react-dialog";
import "../estilos/Livros.css";
import "../estilos/Medias.css";

interface Livro {
  id: number;
  nome: string;
  autor: string;
  ano: number;
  paginas?: number;
  capa?: string;
  lido?: boolean;
}

const Livros = () => {
  const [livros, setLivros] = useState<Livro[]>([]);
  const [id, setId] = useState<number>(0);
  const [nome, setNome] = useState<string>("");
  const [autor, setAutor] = useState<string>("");
  const [ano, setAno] = useState<number>(0);
  const [paginas, setPaginas] = useState<number | undefined>(undefined);
  const [capa, setCapa] = useState<File | null>(null);
  const [busca, setBusca] = useState<string>("");

  const [openAdicionar, setOpenAdicionar] = useState<boolean>(false);
  const [openEditar, setOpenEditar] = useState<boolean>(false);

  // Carrega os livros salvos do localStorage
  useEffect(() => {
    const livrosSalvos = localStorage.getItem("livros");
    if (livrosSalvos) {
      setLivros(JSON.parse(livrosSalvos));
    }
  }, []);

  // Função de adicionar livro
  const adicionarLivro = () => {
    const novoLivro: Livro = {
      id: Date.now(),
      nome,
      autor,
      ano,
      paginas,
      capa: capa ? URL.createObjectURL(capa) : undefined,
      lido: false,
    };

    const livrosAtualizados = [...livros, novoLivro];
    setLivros(livrosAtualizados);
    localStorage.setItem("livros", JSON.stringify(livrosAtualizados));

    resetForm();
    setOpenAdicionar(false);
  };

  // Função para editar livro
  const editarLivro = (livro: Livro) => {
    setId(livro.id);
    setNome(livro.nome);
    setAutor(livro.autor);
    setAno(livro.ano);
    setPaginas(livro.paginas);
    setCapa(livro.capa ? new File([livro.capa], "capa.jpg") : null);
    setOpenEditar(true);
  };

  // Salvar edição de livro
  const salvarEdicao = () => {
    const livrosAtualizados = livros.map((livro) =>
      livro.id === id
        ? {
            ...livro,
            nome,
            autor,
            ano,
            paginas,
            capa: capa ? URL.createObjectURL(capa) : livro.capa,
          }
        : livro
    );
    setLivros(livrosAtualizados);
    localStorage.setItem("livros", JSON.stringify(livrosAtualizados));

    resetForm();
    setOpenEditar(false);
  };

  // Excluir livro
  const excluirLivro = (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este livro?")) {
      const livrosAtualizados = livros.filter((livro) => livro.id !== id);
      setLivros(livrosAtualizados);
      localStorage.setItem("livros", JSON.stringify(livrosAtualizados));
    }
  };

  // Marcar livro como lido
  const marcarComoLido = (id: number) => {
    const livrosAtualizados = livros.map((livro) =>
      livro.id === id ? { ...livro, lido: !livro.lido } : livro
    );
    setLivros(livrosAtualizados);
    localStorage.setItem("livros", JSON.stringify(livrosAtualizados));
  };

  // Filtragem de livros pela busca
  const livrosFiltrados = livros.filter((livro) =>
    livro.nome.toLowerCase().includes(busca.toLowerCase())
  );

  // Função para resetar o formulário
  const resetForm = () => {
    setId(0);
    setNome("");
    setAutor("");
    setAno(0);
    setPaginas(undefined);
    setCapa(null);
  };

  return (
    <div className="container-livros">
      <div className="centralizar-livros">
        <h1>LIVROS</h1>
        <input
          type="text"
          placeholder="Buscar livro..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <div className="cards-livros">
          {livrosFiltrados.map((livro) => (
            <div className="card-livro" key={livro.id}>
              {livro.capa ? (
                <img src={livro.capa} alt="Capa do livro" />
              ) : (
                <div style={{ height: "200px", backgroundColor: "#ccc" }}></div>
              )}
              <h3>{livro.nome}</h3>
              <p>
                <strong>ID do Livro:</strong> {livro.id}
              </p>
              <p>
                <strong>Nome do Livro:</strong> {livro.nome}
              </p>
              <p>
                <strong>Autor do Livro:</strong> {livro.autor}
              </p>
              <p>
                <strong>Ano de Publicação:</strong> {livro.ano}
              </p>
              <p>
                <strong>Páginas:</strong> {livro.paginas || "N/A"}
              </p>
              <div className="botao-container">
                <button
                  className="editar-btn"
                  onClick={() => editarLivro(livro)}
                >
                  Editar
                </button>
                <button
                  className={livro.lido ? "lido-btn verde" : "lido-btn azul"}
                  onClick={() => marcarComoLido(livro.id)}
                >
                  {livro.lido ? "Não lido" : "Lido"}
                </button>
                <button
                  className="excluir-btn"
                  onClick={() => excluirLivro(livro.id)}
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal de Adicionar Livro */}
        <Dialog open={openAdicionar} onOpenChange={setOpenAdicionar}>
          <DialogTrigger asChild>
            <button
              className="adicionar-btn-container"
              onClick={() => {
                resetForm();
                setOpenAdicionar(true);
              }}
            >
              <span className="adicionar-texto">+</span>
            </button>
          </DialogTrigger>
          <DialogContent className="conteudo-modal">
            <DialogTitle>Adicionar Livro</DialogTitle>
            <DialogDescription>Preencha os dados do livro:</DialogDescription>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                adicionarLivro();
              }}
            >
              <div>
                <label>Nome do Livro (obrigatório):</label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </div>

              <div>
                <label>Autor do Livro (obrigatório):</label>
                <input
                  type="text"
                  value={autor}
                  onChange={(e) => setAutor(e.target.value)}
                  required
                />
              </div>

              <div>
                <label>Ano de Publicação (opcional):</label>
                <input
                  type="number"
                  value={ano}
                  onChange={(e) => setAno(parseInt(e.target.value))}
                />
              </div>

              <div>
                <label>Páginas (opcional):</label>
                <input
                  type="number"
                  value={paginas || ""}
                  onChange={(e) =>
                    setPaginas(parseInt(e.target.value) || undefined)
                  }
                />
              </div>

              <div>
                <label>Capa do Livro (opcional):</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setCapa(e.target.files ? e.target.files[0] : null)
                  }
                />
              </div>

              <div className="botao-container">
                <DialogClose asChild>
                  <button className="voltar-btn">Fechar</button>
                </DialogClose>
                <button type="submit" className="adicionar-btn">
                  Adicionar
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Modal de Editar Livro */}
        <Dialog open={openEditar} onOpenChange={setOpenEditar}>
          <DialogContent className="conteudo-modal">
            <DialogTitle>Editar Livro</DialogTitle>
            <DialogDescription>Atualize os dados do livro:</DialogDescription>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                salvarEdicao();
              }}
            >
              <div>
                <label>ID do Livro (obrigatório):</label>
                <input
                  type="number"
                  value={id}
                  onChange={(e) => setId(parseInt(e.target.value))}
                  required
                  disabled
                />
              </div>

              <div>
                <label>Nome do Livro (obrigatório):</label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </div>

              <div>
                <label>Autor do Livro (obrigatório):</label>
                <input
                  type="text"
                  value={autor}
                  onChange={(e) => setAutor(e.target.value)}
                  required
                />
              </div>

              <div>
                <label>Ano de Publicação (opcional):</label>
                <input
                  type="number"
                  value={ano}
                  onChange={(e) => setAno(parseInt(e.target.value))}
                />
              </div>

              <div>
                <label>Páginas (opcional):</label>
                <input
                  type="number"
                  value={paginas || ""}
                  onChange={(e) =>
                    setPaginas(parseInt(e.target.value) || undefined)
                  }
                />
              </div>

              <div>
                <label>Capa do Livro (opcional):</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setCapa(e.target.files ? e.target.files[0] : null)
                  }
                />
              </div>

              <div className="botao-container">
                <DialogClose asChild>
                  <button className="voltar-btn">Fechar</button>
                </DialogClose>
                <button type="submit" className="adicionar-btn">
                  Salvar
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Livros;
