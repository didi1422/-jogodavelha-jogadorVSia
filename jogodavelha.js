let tabuleiro
let board
let aviso

let jogadorAtual = 1        // controla turno real (1 = O, -1 = X)
let jogadorHumano = 1       // escolha do jogador
let ia = -1                 // será ajustado automaticamente

let jogoAtivo = true
let dificuldade = "facil"

function iniciar(){

    tabuleiro = []
    board = document.getElementById('board')
    aviso = document.getElementById('aviso')

    jogoAtivo = true
    jogadorAtual = 1

    for(let i = 0; i < 3; i++){
        tabuleiro[i] = []
        for(let j = 0; j < 3; j++){
            tabuleiro[i][j] = 0
        }
    }

    exibir()

    // define dificuldade padrão visual
    setDificuldade("facil")

    // controla quem começa
    if(jogadorHumano === 1){
        aviso.innerHTML = "Sua vez (O)"
    } else {
        aviso.innerHTML = "IA começa"
        setTimeout(jogadaIA, 500)
    }
}

    exibir()

    if(jogadorHumano === 1){
        aviso.innerHTML = "Sua vez (O)"
    } else {
        aviso.innerHTML = "IA começa"
        setTimeout(jogadaIA, 500)
    }

function setJogador(valor){

    jogadorHumano = valor
    ia = (valor === 1 ? -1 : 1)

    iniciar()
}

function setDificuldade(nivel){

    dificuldade = nivel

    // remove destaque de todos
    document.getElementById("btn-facil").classList.remove("ativo")
    document.getElementById("btn-medio").classList.remove("ativo")
    document.getElementById("btn-dificil").classList.remove("ativo")

    // adiciona no selecionado
    document.getElementById("btn-" + nivel).classList.add("ativo")

    aviso.innerHTML = "Dificuldade: " + nivel.toUpperCase()
}

function exibir(){

    let tabela = '<table cellpadding="10" border="1">'

    for(let i=0;i<3;i++){
        tabela += '<tr>'

        for(let j=0;j<3;j++){

            let marcador = '_'

            if(tabuleiro[i][j] === 1) marcador = 'O'
            if(tabuleiro[i][j] === -1) marcador = 'X'

            tabela += `<td onclick="clicar(${i},${j})">${marcador}</td>`
        }

        tabela += '</tr>'
    }

    tabela += '</table>'
    board.innerHTML = tabela
}

function clicar(i, j){

    if(!jogoAtivo) return
    if(tabuleiro[i][j] !== 0){
        aviso.innerHTML = "Campo já usado"
        return
    }

    if(jogadorAtual !== jogadorHumano) return

    tabuleiro[i][j] = jogadorHumano
    exibir()

    checar(jogadorHumano)
    if(!jogoAtivo) return

    jogadorAtual = ia
    aviso.innerHTML = "Vez da IA"

    setTimeout(jogadaIA, 400)
}

function jogadaIA(){

    if(!jogoAtivo) return

    let jogada

    if(dificuldade === "facil"){
        jogada = jogadaAleatoria()
    }

    if(dificuldade === "medio"){
        jogada = jogadaMedio()
    }

    if(dificuldade === "dificil"){
        jogada = jogadaDificil()
    }

    if(!jogada){
        jogada = jogadaAleatoria()
    }

    tabuleiro[jogada.i][jogada.j] = ia

    exibir()
    checar(ia)

    if(!jogoAtivo) return

    jogadorAtual = jogadorHumano
    aviso.innerHTML = "Sua vez"
}

function jogadaAleatoria(){

    let moves = []

    for(let i=0;i<3;i++){
        for(let j=0;j<3;j++){
            if(tabuleiro[i][j] === 0){
                moves.push({i,j})
            }
        }
    }

    return moves[Math.floor(Math.random() * moves.length)]
}

function jogadaMedio(){

    let win = encontrarJogada(ia)
    if(win) return win

    let block = encontrarJogada(jogadorHumano)
    if(block) return block

    if(tabuleiro[1][1] === 0){
        return {i:1, j:1}
    }

    return jogadaAleatoria()
}

function jogadaDificil(){

    let win = encontrarJogada(ia)
    if(win) return win

    let block = encontrarJogada(jogadorHumano)
    if(block) return block

    if(tabuleiro[1][1] === 0){
        return {i:1, j:1}
    }

    let cantos = [
        {i:0,j:0},{i:0,j:2},{i:2,j:0},{i:2,j:2}
    ]

    for(let c of cantos){
        if(tabuleiro[c.i][c.j] === 0){
            return c
        }
    }

    return jogadaAleatoria()
}

function encontrarJogada(simbolo){

    for(let i=0;i<3;i++){
        for(let j=0;j<3;j++){

            if(tabuleiro[i][j] === 0){

                tabuleiro[i][j] = simbolo
                let venceu = verificarSimulado(simbolo)
                tabuleiro[i][j] = 0

                if(venceu){
                    return {i,j}
                }
            }
        }
    }

    return null
}

function verificarSimulado(simbolo){

    let alvo = simbolo * 3

    for(let i=0;i<3;i++){
        if(tabuleiro[i][0]+tabuleiro[i][1]+tabuleiro[i][2] === alvo) return true
    }

    for(let j=0;j<3;j++){
        if(tabuleiro[0][j]+tabuleiro[1][j]+tabuleiro[2][j] === alvo) return true
    }

    if(tabuleiro[0][0]+tabuleiro[1][1]+tabuleiro[2][2] === alvo) return true
    if(tabuleiro[0][2]+tabuleiro[1][1]+tabuleiro[2][0] === alvo) return true

    return false
}

function checar(jogadorAtual){

    let alvo = jogadorAtual * 3

    for(let i=0;i<3;i++){
        let soma = tabuleiro[i][0]+tabuleiro[i][1]+tabuleiro[i][2]
        if(soma === alvo){
            finalizar(jogadorAtual)
            return
        }
    }

    for(let j=0;j<3;j++){
        let soma = tabuleiro[0][j]+tabuleiro[1][j]+tabuleiro[2][j]
        if(soma === alvo){
            finalizar(jogadorAtual)
            return
        }
    }

    let d1 = tabuleiro[0][0]+tabuleiro[1][1]+tabuleiro[2][2]
    let d2 = tabuleiro[0][2]+tabuleiro[1][1]+tabuleiro[2][0]

    if(d1 === alvo || d2 === alvo){
        finalizar(jogadorAtual)
        return
    }

    if(empate()){
        aviso.innerHTML = "Empate!"
        jogoAtivo = false
    }
}

function finalizar(jogadorAtual){
    aviso.innerHTML = "Vencedor: " + (jogadorAtual === 1 ? "O" : "X")
    jogoAtivo = false
}

function empate(){

    for(let i=0;i<3;i++){
        for(let j=0;j<3;j++){
            if(tabuleiro[i][j] === 0){
                return false
            }
        }
    }

    return true
}