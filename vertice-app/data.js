export const tracks = [
  {
    id: 'aprender-a-aprender', name: 'Aprender a aprender', pillar: 'Autonomia', duration: '8 aulas · 4 módulos · no seu ritmo',
    summary: 'Construa um plano, teste formas de estudar e acompanhe o que faz sentido para você.',
    description: 'Aprender não é acumular páginas. É perceber como uma ideia se transforma quando você pratica, explica e volta a ela com outra pergunta.',
    lessons: [
      { id: 'a-direcao', title: 'Dê direção à sua curiosidade', duration: '12 min',
        idea: 'Um tema amplo é difícil de estudar porque não mostra por onde começar. Uma pergunta concreta cria contorno: em vez de “quero entender fotografia”, experimente “como a luz lateral muda a sensação de um retrato?”. A pergunta não limita o interesse; ela oferece uma primeira janela para olhar.',
        example: 'Pense em algo que você quis aprender recentemente. Que pergunta começaria com “como”, “por que” ou “o que muda quando”?',
        practice: 'Escolha uma curiosidade que acompanha você. Escreva três perguntas possíveis e circule aquela que daria para investigar em uma semana.',
        prompt: 'Qual pergunta específica você quer levar para a sua semana?', excerpt: 'Uma pergunta concreta dá contorno à curiosidade e torna visível um primeiro passo.' },
      { id: 'lembrar-e-conectar', title: 'Lembre sem consultar', duration: '15 min',
        idea: 'Reler pode dar familiaridade, mas familiaridade não é a mesma coisa que conseguir explicar. Fechar o texto e reconstruir a ideia exige que você procure o que ficou. Essa tentativa também mostra com precisão onde vale retornar.',
        example: 'Depois de uma leitura curta, escreva de memória a ideia central e um exemplo. Só então reabra a fonte e compare.',
        practice: 'Leia duas páginas de algo que interessa a você. Feche o material, explique a ideia com suas palavras e anote o ponto que gostaria de conferir.',
        prompt: 'O que você conseguiu recuperar sem consultar a fonte?', excerpt: 'Familiaridade não é a mesma coisa que conseguir explicar uma ideia com as próprias palavras.' },
      { id: 'um-plano-possivel', title: 'Faça um plano que cabe na semana', duration: '10 min',
        idea: 'Um plano útil leva em conta a vida que você já tem. Um bloco pequeno, ligado a um momento específico e a um recurso disponível, costuma ser mais fácil de retomar do que uma intenção vaga. Se a semana muda, o recorte pode mudar também.',
        example: 'Troque “estudar mais” por “na quarta, depois do almoço, vou ler um texto curto e registrar uma dúvida”.',
        practice: 'Defina um momento realista, um recurso que já está ao alcance e uma ação pequena. Se não couber, reduza o recorte.',
        prompt: 'Qual é o menor plano que ainda vale a pena experimentar?', excerpt: 'Um plano é um apoio para escolher o próximo passo, não uma cobrança.' }
    ]
  },
  {
    id: 'perguntar-melhor', name: 'Perguntar melhor', pillar: 'Pensamento crítico', duration: '6 aulas · 3 módulos · no seu ritmo',
    summary: 'Investigue fontes, perceba pressupostos e forme opiniões com mais cuidado.',
    description: 'Pensamento crítico não pede desconfiança automática. Pede curiosidade sobre como uma afirmação foi construída, o que sustenta a ideia e que contexto pode mudar sua leitura.',
    lessons: [
      { id: 'antes-de-compartilhar', title: 'Antes de compartilhar, faça uma pergunta', duration: '11 min',
        idea: 'Uma afirmação pode soar convincente sem trazer evidências suficientes. Antes de decidir se ela está certa, vale perguntar o que exatamente está sendo afirmado e que tipo de observação poderia verificar isso. A pergunta abre espaço para investigação, não para uma resposta apressada.',
        example: '“Ouvir música sempre melhora a concentração.” Que tarefa? Que tipo de som? Para quem? O que a palavra “sempre” esconde?',
        practice: 'Escolha uma frase que você encontrou esta semana. Sublinhe palavras amplas como “todos”, “nunca” ou “comprovado” e escreva uma pergunta de verificação.',
        prompt: 'Que parte da afirmação você conseguiria verificar primeiro?', excerpt: 'Troque “será verdade?” por “como eu poderia verificar?”' },
      { id: 'procure-a-fonte', title: 'Procure a fonte e o contexto', duration: '14 min',
        idea: 'Uma fonte pode ser confiável em um contexto e insuficiente em outro. Observe quem produziu a informação, quando, com que método e para qual pergunta. Contexto ajuda a entender o alcance de uma conclusão; não é uma formalidade ao final da leitura.',
        example: 'Um relato pessoal pode mostrar que uma experiência aconteceu. Para estimar um padrão em muitas pessoas, outra forma de evidência pode ser necessária.',
        practice: 'Retome uma afirmação que chamou sua atenção. Procure a publicação original e anote quem fala, quando e que evidência aparece.',
        prompt: 'Que informação sobre a fonte mudou ou confirmou sua leitura?', excerpt: 'Uma fonte sem contexto ainda deixa perguntas abertas.' },
      { id: 'revise-com-cuidado', title: 'Reescreva com mais cuidado', duration: '9 min',
        idea: 'Uma conclusão bem calibrada diz o que a evidência apoia e reconhece o que permanece em aberto. Rever uma frase não é perder convicção: é fazer com que ela descreva melhor o que se sabe e o que ainda precisa ser investigado.',
        example: '“A música sempre ajuda” pode virar “em algumas tarefas repetitivas, certos tipos de música podem ser úteis para algumas pessoas”.',
        practice: 'Reescreva a frase que investigou. Inclua uma condição, um limite ou uma pergunta que sua fonte não respondeu.',
        prompt: 'Que limite vale a pena deixar claro na sua conclusão?', excerpt: 'Uma conclusão boa reconhece limites e não preenche as lacunas com certeza.' }
    ]
  },
  {
    id: 'criar-conexoes', name: 'Criar conexões', pillar: 'Criatividade', duration: '6 aulas · 3 módulos · no seu ritmo',
    summary: 'Observe o cotidiano e combine referências para experimentar novas possibilidades.',
    description: 'Criar também é perceber relações que ainda não estavam evidentes. Atenção, combinação e tentativa transformam objetos e ideias conhecidas em novos pontos de partida.',
    lessons: [
      { id: 'olhar-de-novo', title: 'Observe antes de nomear', duration: '10 min',
        idea: 'Quando damos um nome rápido a uma coisa, passamos a enxergá-la por uma categoria conhecida. Descrever o que realmente vemos, ouvimos e sentimos pode revelar detalhes que uma interpretação pronta deixaria passar.',
        example: 'Uma cadeira pode ser “um móvel”. Também é uma junção de ângulos, materiais, marcas de uso, equilíbrio e escolhas de quem a fez.',
        practice: 'Escolha um objeto cotidiano. Anote cinco observações concretas sem dizer para que ele serve. Depois veja que novas perguntas apareceram.',
        prompt: 'Que detalhe você quase não percebeu da primeira vez?', excerpt: 'A observação atenta encontra possibilidades no que parecia familiar.' },
      { id: 'combinar-referencias', title: 'Combine referências distantes', duration: '13 min',
        idea: 'Uma ideia pode ganhar outro contorno quando encontra uma referência de um campo diferente. A combinação não precisa ser original de imediato. Um primeiro paralelo pode gerar perguntas melhores e sugerir um experimento que você ainda não havia considerado.',
        example: 'Uma horta comunitária e uma biblioteca têm algo em comum: ambas cuidam de recursos compartilhados ao longo do tempo.',
        practice: 'Escolha duas coisas que parecem não ter relação. Liste três semelhanças e três diferenças. Use uma delas para imaginar um projeto pequeno.',
        prompt: 'Que conexão ficou mais interessante depois de olhar de perto?', excerpt: 'Uma nova conexão pode mudar a pergunta antes de mudar a resposta.' },
      { id: 'experimente-uma-variacao', title: 'Experimente uma variação', duration: '12 min',
        idea: 'Uma possibilidade se torna mais clara quando ganha uma forma que pode ser testada. Variar um elemento de cada vez ajuda a observar o que realmente muda. O resultado não precisa funcionar para ensinar alguma coisa sobre o caminho.',
        example: 'Ao organizar um canto de leitura, experimente mudar somente a posição da luz e perceba como o espaço passa a convidar a uma atividade diferente.',
        practice: 'Pegue a ideia ou a conexão que registrou. Faça uma versão pequena, mude um aspecto e anote o que observou.',
        prompt: 'O que essa pequena variação ensinou sobre a sua ideia?', excerpt: 'Experimentar uma variação torna uma possibilidade observável.' }
    ]
  },
  {
    id: 'ler-o-mundo', name: 'Ler o mundo', pillar: 'Repertório', duration: '8 aulas · 4 módulos · no seu ritmo',
    summary: 'Encontre relações entre cultura, ciência e as perguntas que atravessam a sua vida.',
    description: 'Repertório é aquilo que você pode relacionar, interpretar e usar para pensar. Ampliar repertório não exige saber tudo; exige curiosidade para comparar perspectivas e reconhecer as perguntas que elas tornam possíveis.',
    lessons: [
      { id: 'uma-ideia-em-contexto', title: 'Leia uma ideia em contexto', duration: '12 min',
        idea: 'Uma ideia é produzida em um tempo, lugar e conversa específicos. Conhecer o contexto ajuda a perceber por que certas perguntas eram importantes e que vozes foram ouvidas. Isso permite ler sem arrancar a ideia das condições em que ela surgiu.',
        example: 'Uma fotografia registra uma cena, mas também registra escolhas: de onde alguém olhou, o que entrou no quadro e o que permaneceu fora dele.',
        practice: 'Escolha uma imagem, notícia ou trecho que encontrou hoje. Procure quando e por quem foi produzido, e registre uma pergunta sobre o que não aparece.',
        prompt: 'Que parte do contexto mudou sua interpretação?', excerpt: 'Contexto ajuda a perceber o que uma fonte mostra e o que deixa de fora.' },
      { id: 'compare-perspectivas', title: 'Compare perspectivas', duration: '15 min',
        idea: 'Duas fontes podem olhar para o mesmo assunto a partir de perguntas diferentes. Comparar não significa escolher uma e descartar a outra. Significa tornar visíveis os critérios, experiências e limites que ajudam a explicar por que cada uma apresenta um recorte particular.',
        example: 'Um mapa de transporte e o relato de quem usa a linha todos os dias descrevem a mesma cidade, mas oferecem informações diferentes.',
        practice: 'Procure duas perspectivas sobre o mesmo tema. Anote o que cada uma ajuda a compreender e uma pergunta que continua aberta.',
        prompt: 'O que você só percebeu ao colocar as perspectivas lado a lado?', excerpt: 'Comparar perspectivas mostra os recortes que cada fonte escolheu.' },
      { id: 'construa-repertorio', title: 'Construa relações que ficam', duration: '10 min',
        idea: 'Uma anotação se torna mais útil quando se conecta a outra ideia, experiência ou pergunta. As relações ajudam a recuperar o que você aprendeu e podem apontar novos caminhos. Repertório não é uma coleção sem ordem; é uma rede que você continua revendo.',
        example: 'Uma leitura sobre memória pode se ligar a uma conversa com alguém mais velho, a uma fotografia de família e a uma pergunta sobre como objetos contam histórias.',
        practice: 'Abra duas anotações ou ideias que você guardou. Escreva em uma frase o que as aproxima e em outra o que ainda as diferencia.',
        prompt: 'Que nova pergunta apareceu entre essas duas ideias?', excerpt: 'Uma ideia ganha novos caminhos quando encontra outra.' }
    ]
  }
];

export const sampleTexts = [
  { id: 'memoria', label: 'Memória e atenção', text: 'A memória não funciona como uma estante em que cada experiência fica guardada intacta. Ao lembrar, reconstruímos uma versão do que aconteceu a partir de pistas, conhecimentos atuais e da pergunta que estamos tentando responder. Isso não torna a lembrança inútil: mostra por que comparar fontes e anotar o contexto pode ajudar quando a precisão importa.' },
  { id: 'cidade', label: 'A cidade que caminhamos', text: 'Uma calçada não é apenas uma faixa entre a rua e os prédios. Sua largura, sombra, conservação e travessias influenciam quem consegue circular e por quanto tempo. Observar uma rua a pé permite notar detalhes que uma viagem de carro pode esconder. O espaço público também comunica quem foi considerado em seu planejamento.' },
  { id: 'curiosidade', label: 'Curiosidade e perguntas', text: 'Curiosidade pode começar com uma dúvida pequena e ganhar forma quando alguém decide observá-la com atenção. Uma pergunta delimitada não encerra as possibilidades; ela torna mais fácil escolher uma primeira experiência. Se a resposta abre outra dúvida, isso também faz parte do aprendizado: a compreensão se move por aproximações e revisões.' }
];

export const seedPosts = [
  { id: 'seed-1', author: 'Helena', trackId: 'aprender-a-aprender', kind: 'tentativa', text: 'Troquei a intenção de “ler mais” por dez minutos antes do café. Fiz só três dias, mas descobri que o horário importava mais que o tamanho da meta.', createdAt: '2026-11-21T10:30:00.000Z', replies: [{ id: 'r1', author: 'Rafael', text: 'Gostei do detalhe sobre o horário. O que você vai experimentar na próxima semana?' }] },
  { id: 'seed-2', author: 'Rafael', trackId: 'perguntar-melhor', kind: 'pergunta', text: 'Quando uma fonte cita um estudo, que pistas ajudam a saber se ela está representando a pesquisa com cuidado?', createdAt: '2026-11-20T15:20:00.000Z', replies: [{ id: 'r2', author: 'Lia', text: 'Tenho tentado localizar a pesquisa original e conferir se a conclusão do texto corresponde ao resumo do estudo.' }] },
  { id: 'seed-3', author: 'Lia', trackId: 'criar-conexoes', kind: 'tentativa', text: 'Desenhei o caminho que faço para o mercado e marquei onde costumo parar. Percebi que conhecia melhor as fachadas do que o nome de qualquer árvore do trajeto.', createdAt: '2026-11-19T12:10:00.000Z', replies: [] },
  { id: 'seed-4', author: 'Caio', trackId: 'ler-o-mundo', kind: 'pergunta', text: 'O que muda quando lemos uma fotografia junto com a legenda e o lugar onde foi publicada?', createdAt: '2026-11-18T09:45:00.000Z', replies: [{ id: 'r3', author: 'Helena', text: 'A legenda pode abrir um contexto, mas também direciona nossa leitura. Vale procurar quem escolheu cada elemento.' }] },
  { id: 'seed-5', author: 'Marina', trackId: 'aprender-a-aprender', kind: 'tentativa', text: 'Expliquei uma ideia de um artigo para minha irmã sem olhar o texto. A pergunta dela me mostrou um trecho que eu tinha lido, mas não compreendido ainda.', createdAt: '2026-11-17T17:05:00.000Z', replies: [] }
];
